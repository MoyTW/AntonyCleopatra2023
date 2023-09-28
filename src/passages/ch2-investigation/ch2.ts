interface Ch2 {}

(function () {
  class Ch2Impl implements Ch2 {
    onEndInterview = () => {
      console.log('on end interview fired')
      const btnRegex = /<div id=["']options["']>.*<\/div>/i;
      const passage = $(".passage")[0]
      if (passage) {
        const ts = passage.innerHTML
                          .replace(btnRegex, '')
                          .trimEnd()
        // Identify the client
        // 8E8DBD2A-FEFA-4600-A93B-AC499CA5C8B6
        const storage = window.localStorage
        /*const storedClientId = storage.getItem(`D7EEB4F6-CCC2-43E3-AD93-B5855945E8EC_ClientId`)

        if (storedClientId && _isUuid(storedClientId)) {
          _clientId = storedClientId
          console.log('Retrieved clientId from localstorage as ' + storedClientId)
        } else {
          const newClientId = _uuidv4()
          storage.setItem(`D7EEB4F6-CCC2-43E3-AD93-B5855945E8EC_ClientId`, newClientId)
          _clientId = newClientId;
          console.log('Generated new clientId as ' + newClientId)
        }

        Dialog.setup('review', 'TRANSCRIPT_CLASS');
        Dialog.wiki(ts);
        Dialog.open();*/
      }
    }
  }

  (setup as any).Ch2 = new Ch2Impl()
})()