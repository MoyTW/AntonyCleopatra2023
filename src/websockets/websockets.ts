/**
 * State variables used:
 * 1. $sessionId
 * 2. $shouldBeConnected
 * 3. $websocketProcessedUpToMs
 */

 (function () {
  const NETWORK_DIALOG_CLASS = 'networkerrordialog'
  // TODO: Have receive resolve the second argument
  const ROLE_ALL = 'ALL'
  const ROLE_HOST = 'HOST'
  const ROLE_CLIENT = 'CLIENT'

  var _clientId: string | undefined = undefined
  var _chatSocket: WebSocket | undefined = undefined
  const _handlers: Record<string, Record<string, (data: object) => void>> = {}
  const _sendBuffer: object[] = []

  // TODO: Write an "initialize" macro which takes DEBUG & DEV_SERVER_URL/PROD_SERVER_URL
  // Deliberately not tying it into Sugarcube's debug because turning that on makes everything hideous
  const DEBUG: boolean = true;
  const DEV_SERVER_URL: string = 'ws://localhost:8000/ws/';
  // Ideally, this would be read via the sugarcube configs, but I think I'd have to hack sugarcube (more) to do that.
  const PROD_SERVER_URL: string = '';

  const _registerHandler = function(messageType: string, handlerKey: string, handler: (data: object) => void) {
    if (_handlers[messageType] == undefined) {
      _handlers[messageType] = {}
    }
    _handlers[messageType][handlerKey] = handler
  };

  const _processMessage = function(message: any) {
    console.log('Processing message: ', message['type']);
    const handlersByRole = _handlers[message['type']];
    for (var role in handlersByRole) {
      if (_hasRole(role)) {
        handlersByRole[role](message)
      }
    }
  }

  const _connect = function(sessionId: string, sendOnOpen?: object) {
    // If we already have a connection or are attempting to establish a connection, leave it be!
    if (_chatSocket && _chatSocket.readyState == 0) {
      if (sendOnOpen) {
        _sendBuffer.push(sendOnOpen)
      }
      return
    } else if (_chatSocket && _chatSocket.readyState == 1) {
      if (sendOnOpen) {
        _chatSocket.send(JSON.stringify(sendOnOpen))
      }
      return
    } else if (_chatSocket) {
      console.log('chatSocket already exists, wait for it to close before opening another!')
      return
    }

    State.setVar('$shouldBeConnected', true)

    // @ts-ignore: Unreachable code error
    if (DEBUG === false) {
      _chatSocket = new WebSocket(PROD_SERVER_URL + sessionId + '/');
    } else {
      _chatSocket = new WebSocket(DEV_SERVER_URL + sessionId + '/');
    }

    if (sendOnOpen) {
      _sendBuffer.push(sendOnOpen);
    }
    _chatSocket.onopen = function(_: any) {
      if (Dialog.isOpen(NETWORK_DIALOG_CLASS)) {
        Dialog.close()
      }

      _chatSocket!.send(JSON.stringify({
        'type': 'CATCH_UP',
        'clientId': _clientId,
        // We use current because we want every message since our last save
        // TODO: If you join an in-progress game through join instead of using the load button, this will be 0 and you'll
        // get the entire list, changing the state in unexpected ways!
        'catchupStartMs': (State.current as any).variables.websocketProcessedUpToMs || 0
      }));
      for (const toSend of _sendBuffer) {
        console.log('Sending buffered message, type:', (toSend as any)['type']);
        _chatSocket!.send(JSON.stringify(toSend));
      }
      _sendBuffer.splice(0, _sendBuffer.length);
    }

    _chatSocket.onmessage = function(e: MessageEvent<any>) {
      const message = JSON.parse(e.data);
      State.setVar('$websocketProcessedUpToMs', message['server_timestamp_ms'])
      _processMessage(message)
    };

    _chatSocket.onerror = function(ev: Event) {
      console.error('Websocket error: ', ev)
    }

    _chatSocket.onclose = function(ev: CloseEvent) {
      if (State.getVar('$shouldBeConnected') === true) {
        console.error('Websocket connection closed unexpectedly: ', ev);
        if (!Dialog.isOpen(NETWORK_DIALOG_CLASS)) {
          Dialog.setup('Network error!', NETWORK_DIALOG_CLASS);
          Dialog.wiki(Story.get('NetworkErrorDialog').processText());
          Dialog.open();
          console.log('Network error dialog opened.')
        }
      } else {
        console.log('Websocket connection closed: ', ev);
      }
      _chatSocket = undefined
    }
  }

  const _send = function(sessionId: string, obj: object) {
    if (typeof sessionId !== 'string') {
      throw `Cannot send to session ${sessionId}`
    }
    if (typeof obj !== 'object') {
      throw `Cannot send object ${obj} to session ${sessionId} as it's not an object!`
    }
    if (_chatSocket && _chatSocket.readyState == 1) {
      _chatSocket.send(JSON.stringify(obj));
    } else {
      _connect(sessionId, obj);
    }
  }

  _registerHandler('CATCH_UP', 'ALL', function(data: any) {
    const serializedSave = data['serialized_save']
    console.log('Attempting to catch up! Loading:', serializedSave !== undefined);
    if (serializedSave) {
      Save.deserialize(serializedSave);
    }
    for (const message of data['messages']) {
      // TODO: There's surely a more elegant way of dealing with this
      if (message['type'] !== 'clientJoin') {
        _processMessage(message)
      }
    }
    State.setVar('$websocketProcessedUpToMs', data['server_timestamp_ms']);
    console.log('Caught up to ' + State.getVar('$websocketProcessedUpToMs'));
  })

  Macro.add('connect', {
    handler: function() {
      if (this.args.length != 1) {
        return this.error(`bad evaluation: connect macro can only take 1 parameter, the sessionId`);
      }
      if (typeof this.args[0] !== 'string') {
        return this.error(`bad evaluation: connect macro input ${this.args[0]} was not a string!`);
      }
      _connect(this.args[0]);
    }
  })

  Macro.add('send', {
    skipArgs: false,
    tags: null,
    handler: function() {
      if (!State.getVar('$sessionId')) {
        return this.error(`Cannot send; no sessionId set!`);
      }

      // This is very janky!
      const rest = this.args.full.startsWith("State.temporary") || this.args.full.startsWith("State.variable") ?
        this.args.full.replace(this.args.full.split(' ')[0], '').trim() :
        this.args.full.replace(this.args[0], '').slice(3).trim()
      if (!rest) {
        return this.error(`Cannot send: no data object specified! Use {} for an empty data object.`);
      }

      try {
        Scripting.evalJavaScript('State.temporary.websocketTemp = ' + rest);
      } catch (err: any) {
        return this.error(`bad evaluation: ${typeof err === 'object' ? err.message : err}`);
      }
      const result = State.temporary.websocketTemp;
      if (typeof result !== 'object') {
        return this.error(`evaluation of object passed to send was ${result}, not an object!`);
      }
      if (result['type'] !== undefined || result['clientId'] !== undefined) {
        return this.error(`type and clientId are reserved properties on a message object!`);
      }

      const msgObj = {type: this.args[0], clientId: _clientId};
      Object.assign(msgObj, result);
      _send(State.getVar('$sessionId'), msgObj);

      if (this.payload[0].contents !== '') {
        this.createShadowWrapper(() => Wikifier.wikifyEval(this.payload[0].contents.trim()))();
      }
    }
  })

  /**
   * <<receive messageType>>contents<</receive>> executes contents when a message of type messageType is received.
   *
   * However, it is not assured that the macro is called on the same page as it is defined. Therefore, any contents which
   * rely on the objects of the page (say <<replace>>) will throw an error when called off-page. Avoid any such macros
   * and instead use caught javascript.
   */
  Macro.add('receive', {
    tags: null,
    handler: function() {
      // TODO: Possibly add in a no-op if you've already preprocessed the tags?
      if (typeof this.args[0] !== 'string' || this.args[0] == '') {
        return this.error(`Receive macro's first arg, ${this.args[0]} is not a valid string!`);
      }
      if (typeof this.args[1] !== 'string' || this.args[1] == '') {
        return this.error(`Receive macro's second arg, ${this.args[1]} is not a valid string!`);
      }
      if (_handlers[this.args[0]] != undefined && _handlers[this.args[0]][this.args[1]]) {
        return;
      }

      if (DEBUG) {
        console.log(`Found receive macro for ${this.args[0]}`);
      }

      const macroPayload = this.payload;
      const payloadFn = function(data: object) {
        if (State.temporary.receiveData !== undefined) {
          console.error('_receiveData is set when it should not be! Overwriting!')
        }
        State.temporary.receiveData = data;

        if (macroPayload[0].contents !== '') {
          Wikifier.wikifyEval(macroPayload[0].contents.trim());
        }

        State.temporary.receiveData = undefined;
      }

      _registerHandler(this.args[0], this.args[1], payloadFn)
    }
  })

  const _preprocessReceiveTags = function() {
    console.log(`Preprocessing all receive tags.`)

    const opener = /<<receive/g;
    const closer = /<<\/receive>>/g;
    const allPassages = Story.lookupWith((_: TwineSugarCube.Passage) => true);

    for (let passage of allPassages) {
      const openerMatches = [...passage.text.matchAll(opener)];
      const closerMatches = [...passage.text.matchAll(closer)];
      if (openerMatches.length == 0 && closerMatches.length == 0) {
        continue;
      }
      // We don't actually need to check that they're closed or open - Sugarcube does that for us!

      var previousEndIdx = 0;
      for (let i = 0; i < openerMatches.length; i++) {
        const startIdx: number = openerMatches[i].index!;
        const endIdx: number = closerMatches[i].index! + 12; // length of <</receive>>

        if (startIdx < previousEndIdx) {
          throw 'Overlapping receive tags in passage ' + passage.title + '!';
        }
        previousEndIdx = endIdx;

        Wikifier.wikifyEval(passage.text.substring(startIdx, endIdx));
      }
    }
  }

  Macro.add("leavemultiplayersession", {
  /* TODO: Bring up save management or cycle the saves or something! */
    handler: function() {
      const sessionId = State.getVar('$sessionId')
      var openSlot = undefined;

      for (let i = 0; i < Save.slots.length; i++) {
        const saveInSlot = Save.slots.get(i);
        if (saveInSlot && saveInSlot.title.includes(sessionId)) {
          Save.slots.save(i, 'Session ' + sessionId);
          Save.autosave.delete();
          Engine.restart();
          return;
        }
        if (!Save.slots.has(i)) {
          openSlot = i;
        }
      }

      if (openSlot !== undefined) {
        Save.slots.save(openSlot, 'Session ' + sessionId);
      } else {
        console.error('TODO: Too many save slots!')
      }

      Save.autosave.delete();
      Engine.restart();
    }
  })

  Macro.add('endmultiplayergame', {
    handler: function() {
      const sessionId = State.getVar('$sessionId')
      for (let i = 0; i < Save.slots.length; i++) {
        const saveInSlot = Save.slots.get(i)
        if (saveInSlot && saveInSlot.title.includes(sessionId)) {
          Save.slots.delete(i)
          break
        }
      }
      Save.autosave.delete()
      Engine.restart()
    }
  })

  // We preprocess the receive tags exactly once, when the javascript is evaluated. This relies upon the fact that the
  // passages have been already loaded and Story.passages() will appropriately return them; if this ever changes, well,
  // good luck! Hopefully it won't!
  _preprocessReceiveTags()

  // When the passage starts, before the passage is rendered but after the state is changed, reconnect & attempt save
  // management. We want to skip the very first invocation on page refresh/game entry.
  var hasVisitedOnPassageReady = false;
  $(document).on(':passagestart', function (ev) {
    // Ensure or start the connection & catch up.
    if (State.getVar('$shouldBeConnected') === true) {
      _connect(State.getVar('$sessionId'));
    }

    // We always want to skip the first invocation, because that's right after game start.
    if (!hasVisitedOnPassageReady) {
      hasVisitedOnPassageReady = true;
      return;
    }

    // Any following invocation will only happen after a scene transfer.
    // Note that autosave.save() and Save.serialize() DO NOT take the current state, they take the state on transition.
    // Therefore, the fact that you may or may not have had state changes due to messages when this runs is irrelevant.
    console.log('Autosaving for scene: ', State.passage, ' session: ', State.getVar('$sessionId'));
    Save.autosave.save();
    if (State.getVar('$shouldBeConnected') === true) {
      _send(State.getVar('$sessionId'), {
        'type': 'AUTOSAVE',
        'clientId': _clientId,
        'serializedSave': Save.serialize()
      });
    }
  });

  // Because the error dialog will disable the ability to exit, re-enable on dialog close
  $(document).on(':dialogclosed', function (ev) {
    $("#ui-overlay").addClass("ui-close");
    $('#ui-dialog-close').show()
  })

  // Client identification utilities
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const _isUuid = function(s: string) {
    return uuidRegex.test(s)
  }

  const _uuidv4 = function() {
    return (`10000000-1000-4000-8000-100000000000`).replace(/[018]/g, c =>
      ((c as any) ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> (c as any) / 4).toString(16)
    );
  }

  // Identify the client
  const storage = window.localStorage
  const storedClientId = storage.getItem(`D7EEB4F6-CCC2-43E3-AD93-B5855945E8EC_ClientId`)

  if (storedClientId && _isUuid(storedClientId)) {
     _clientId = storedClientId
    console.log('Retrieved clientId from localstorage as ' + storedClientId)
  } else {
    const newClientId = _uuidv4()
    storage.setItem(`D7EEB4F6-CCC2-43E3-AD93-B5855945E8EC_ClientId`, newClientId)
    _clientId = newClientId;
    console.log('Generated new clientId as ' + newClientId)
  }

  /*******************************************************************************************************************
   * External functions                                                                                              *
   *******************************************************************************************************************/
  (setup as any).Websocket = {};

  // Used in websockets.twee
  (setup as any).Websocket.hasSocket = function(): boolean {
    if (_chatSocket) {
      return true
    } else {
      return false
    }
  };

  (setup as any).Websocket.getClientId = function(): string | undefined {
    return _clientId
  };

  (setup as any).Websocket.uuidv4 = function(): string {
    return _uuidv4()
  };

  (setup as any).Websocket.isUuid = function(s: string): boolean {
    return _isUuid(s)
  };

  // TODO: Work this into the receive macro
  (setup as any).Websocket.assignRoleToClient = function(role: string, clientId: string) {
    var roles: { [key: string]: string[] | undefined } | undefined = State.getVar('$websocketRoles')
    if (!roles) {
      roles = {}
      State.setVar('$websocketRoles', roles)
    }
    if (!roles[clientId]) {
      roles[clientId] = [role]
    } else {
      roles[clientId]!.push(role)
    }
  };

  const _hasRole = function(role: string): boolean {
    const roles: { [key: string]: string[] | undefined } = State.getVar('$websocketRoles')
    const clientId = State.getVar('$clientId')

    if (!roles) {
      console.error(`No roles registered for ${clientId}!`)
      return false
    } else {
      return roles[clientId]!.includes(role)
    }
  };
  (setup as any).Websocket.hasRole = _hasRole;
}());