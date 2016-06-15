# Simple Message Preprocessor

### Overview
This module allows parsing special syntax in messages and providing with contextual information

### Requirements
In order to the code to work properly you need to be running:
- **node.js** version at least **v5.0.0**
- **npm** version not lower than **v3.0.0**

### Installation
```bash
# cloning the repo
git clone https://gitlab.com/knicefire/hipchat-message-preprocessor.git
cd hipchat-message-preprocessor

# installing dependency
npm install

# running tests
npm test

# working with CLI
node cli.js 'Hello @chris, how are you?'
node cli.js 'hello @world, how about some (coffee)?'
```


### Plugins
The module is highly configurable and supports custom text processors to be added on runtime

### Text preprocessors supported in the package
- **Mentions:** A way to mention a user. Always starts with an '@' and ends when hitting a non-word character.
        example: "@chris you around?"
- **Emoticons:** Alphanumeric strings, no longer than 15 characters, contained in parenthesis
        example: "Good morning! (megusta) (coffee)"
- **Links:** Any URLs contained in the message, along with the page's title.
        example: "Olympics are starting soon; http://www.nbcolympics.com"

### Conventions
A plugin must implement following interface
- **matcher**: a function to which a message is given. should return a context if any
- **name**: the name of the plugin which will be used as a property name in the resulted object

### Processing the message
The message is passing to a chain of processors each of which returns found context.
The context is attached to the resulted object. If no context has been returned, the resulted object won't contain any mentioning of the processor
<pre>
Example:

Input: "@chris you around? would you like a coup of (coffee)?"
Output: {
    mentions: [
        "chris"
    ],
    emotions: [
        "coffee"
    ]
}
</pre>

### Usage
```js

const preprocessor = require('hipchat-message-preprocessor');

// enable buld-in preprocessors
preprocessor.use('emotions', 'mentions', 'links');

// adding custom preprocessor
preprocessor.use({
    name: 'words',
    matcher(message) {
        const uniqueWords = Array.from(new Set(message.split(/\s/)));

        return {
            unique: uniqueWords,
            count : uniqueWords.length
        };
    }
});

// attaching to a stream
socket.on('message', (message) => {
    const context = preprocessor.onMessage(message);

    socket.reply({
        message: message,
        context: context
    });
});

```
