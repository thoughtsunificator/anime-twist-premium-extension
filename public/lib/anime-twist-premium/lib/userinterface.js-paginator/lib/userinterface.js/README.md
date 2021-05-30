# userinterface.js [![Build Status](https://travis-ci.com/thoughtsunificator/userinterface.js.svg?branch=master)](https://travis-ci.com/thoughtsunificator/userinterface.js) [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/thoughtsunificator/userinterface.js-skeleton)

userinterface.js was built around the idea that logic relating to how the visual looks and how the visual works should be distinguished.

## Summary

- [Getting started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Installing](#installing)
		- [Scaffold](#scaffold)
		- [Standalone](#standalone)
	- [Model](#model)
		- [Basic model](#basic-model)
		- [Children](#children)
		- [Callback](#callback)
		- [Processed properties](#processed-properties)
	- [Binding](#binding)
	- [Objects](#objects)
	- [Listeners](#listeners)
		- [Main object](#main-object)
		- [Listening to events](#listening-to-events)
		- [Announcing events](#announcing-events)
		- [Removing event listeners](#removing-event-listeners)
- [Methods](#methods)
- [API](#api)
- [Common errors](#common-errors)
- [Collection](#collection)
- [Extensions](#extensions)
- [Demos](#demos)
- [Running the tests](#running-the-tests)

## Getting started

### Prerequisites

None, 100% pure Vanilla JS :)

### Installing

#### Scaffold

To get started with userinterface.js all you need to do is scaffold a new project by following the instructions on the [userinterface.js-skeleton](https://github.com/thoughtsunificator/userinterface.js-skeleton) repository.

#### Standalone

In order to be able to use userinterface.js in the browser you can use git submodules.

Run ```git submodule add https://github.com/thoughtsunificator/userinterface.js.git lib/userinterface.js``` at the root of your project.

userinterface.js is located in the ```lib/``` folder at the root of your project.

### Model

A ```Model``` is an object representation of a [Node](https://developer.mozilla.org/en-US/docs/Web/API/Node).
It has three required properties depending on the method: ```name```, ```method``` and ```properties``` or ```callback```,

The ```name``` property will be the identifier of your model it will be used whenever you need to run your model but also to associate a binding to your model.
The ```method``` property will describe how your model should be ran.
The ```properties``` and ```callback``` properties will contain the properties of your Elements.

A ```Model``` often goes along with a [Binding](#Binding) and an [Object](#Object).

#### Basic model

We create a model named ```simple model``` with the method ```appendChild``` it has a one ```LI``` [element](https://developer.mozilla.org/en-US/docs/Web/API/Element) children that have the className ```simplemodel``` and textContent ```My first simple model```.
Yes you got it, every properties (except ```children```) will be set to the [element](https://developer.mozilla.org/en-US/docs/Web/API/Element).

``src/userinterface/simplemodel.js``
```js
UserInterface.model({
	name: "simplemodel",
	method: UserInterface.appendChild,
	properties: {
		tagName: "li", // required
		className: "simplemodel",
		textContent: "My first simple model"
	}
});
```

```js
UserInterface.runModel("simplemodel", { parentNode: document.querySelector("ul") });
```
Output:
```html
<ul>
	<li class="simplemodel">My first simple model</li>
</ul>
```

#### Children

In the previous example we created a simple model, but what if we wanted to do more and add some children to it ?
The ```children``` property is here for that, it is an Array where you can specify child elements.

``src/userinterface/children.js``
```js
UserInterface.model({
	name: "children",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div",
		className: "model",
		children: [
			{
				tagName: "div",
				className: "child",
				textContent: "My first child"
				// and so on..
			}
		]
	}
});
```

```js
UserInterface.runModel("children", { parentNode: document.body });
```
Output:
```html
<body>
	<div class="model">
		<div class="child">My first child</div>
	</div>
</body>
```
#### Callback

Models are required to have either the ```properties``` property or ```callback``` property, but exactly what does the ```callback``` property do ?
It is used when you want to echo some data in your model.

For example here, we have a model called ```echomodel``` that has the ```callback``` property. This property works the same as the ```properties``` property does except that an extra step is added before your model is ran.
The ```callback``` will return a ```properties``` object accordingly to the data you passed through ```runModel```.

``src/userinterface/echomodel.js``
```js
UserInterface.model(
	name: "echomodel",
	method: UserInterface.appendChild,
	callback: data => ({
		tagName: "p",
		className: "echomodel",
		textContent: "My "+data.text+" model"
	})
);
```

```js
UserInterface.runModel("echomodel", { parentNode: document.body, data: {"text": "echo" } });
```

Output:
```html
<p class="echomodel">My echo model</p>
```

#### Processed properties

- ``children`` Add children to an element


### Binding

A ```Binding``` is a callback function that, when bound to a model, is automatically called whenever the model has ran.
```Bindings``` will make your models more alive, an example of that would be adding an event listener to your model, that is the place where you will be doing it.

You can also do much more such as using event listeners to connect all of your models together!

A Binding is way to give life to your models enabling them to do things whenever their respective method is executed.
That means if you want to add a listener to an Element that's where you will be doing it.

In this example we will change the textContent of our model root element.

``src/userinterface/button.js``
```js
UserInterface.model({
	name: "button",
	method: UserInterface.appendChild,
	properties: {
		tagName: "button"
	}
});

UserInterface.bind("button", function(element) {
	element.textContent = "bound";
});
```

```js
UserInterface.runModel("button", { parentNode: document.body });
```

Output:
```html
<button>bound</button>
```

### Objects

```Objects``` are the backbone of your models they will store and manipulate data for your ```Binding```.
That's where you want to hide the complicated stuff.

### Listeners

Listeners enable intercommunication for your models.

#### Main object

You usually wants to have a ``main object`` that you will pass to most of your models so that they communicate with each other through a central.

Note that you are not forced to have one and you could have multiple observables and still be able to handle inter-model communication.

Most of the time we call it ``application``.

#### Listening to events

In this example we are creating and running a model called ```myModel``` that will listen for the event ``greeting`` on through the ``application`` context.

A Context represent a reserved area (a channel) that events will be bound to, they're often represented as an instance of an object but could pretty much be anything.

``src/userinterface/my-model.js``
```js
UserInterface.model({
	name: "myModel",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div"
	}
});
UserInterface.bind("myModel", function(element, application) {

	UserInterface.listen(application, "greeting", async (message) => {
		console.log(message)
	})

});
```


```js
const application = {}

UserInterface.runModel("myModel", { parentNode: document.body, bindingArgs: [application] });
```

For the moment we are only listening to the ``greeting`` event, we haven't announced anything to it yet.

#### Announcing events

In the previous example we setup a ``greeting`` listener on ``application``.

Now, let's try to announce to the event.

``src/userinterface/another-model.js``
```js
UserInterface.model({
	name: "anotherModel",
	method: UserInterface.appendChild,
	properties: {
		tagName: "div"
	}
});
UserInterface.bind("anotherModel", function(element, application) {

	UserInterface.announce(application, "greeting", "Hello!");

});
```

```js
const application = {}

UserInterface.runModel("myModel", { parentNode: document.body, bindingArgs: [application] });
UserInterface.runModel("anotherModel", { parentNode: document.body, bindingArgs: [application] });
```

If everything went well you should be able see a ``Hello!`` log message in the console.

#### Removing event listeners

Sometimes you might want your model to be dynamically added and removed, meaning that it will be added upon an action and removed upon another action.

The issue is that if you added event listeners to an object you need to clean the object from all the listeners that were added by this binding otherwise as your binding is executed multiple times the same listeners keep adding.

Usually what you want to do is to create ``_listener`` variable and push all the listeners to this array and then remove them as needed using ``forEach`` for example.

In this example, we create a listener ``message`` and remove it whenever the event ``done`` is emitted.

```javascript
UserInterface.bind("myDynamicModel", function(element, application) {

	const _listeners = []

	_listeners.push(UserInterface.listen(application, "message", async data => {
		console.log(data)
	}))

	_listeners(UserInterface.listen(application, "done", async () => {
		_listeners.forEach(listener => UserInterface.removeListener(listener))
	}))

})
```

### Methods

- ```appendChild``` Append your model to the target

- ```insertBefore``` Insert your model before the target

- ```removeElement``` Remove the target

- ```replaceElement``` Replace the target with your model

- ```updateElement``` Update the target according to your model

- ```wrapElement``` Wrap the target inside your model

- ```removeListeners``` Remove the listeners of the target

### API

<dl>
<dt><a href="#model">model(model)</a></dt>
<dd><p>Load a model</p>
</dd>
<dt><a href="#bind">bind(name, callback)</a></dt>
<dd><p>Link a model to a &quot;binding&quot;, that is a callback function</p>
</dd>
<dt><a href="#runModel">runModel(name, parameters)</a></dt>
<dd><p>Update the DOM accordingly to a model</p>
</dd>
<dt><a href="#createElement">createElement(properties, [callback])</a> ⇒ <code>Element</code></dt>
<dd><p>Transform a model into an Element</p>
</dd>
<dt><a href="#getModelProperties">getModelProperties(name, [data])</a> ⇒ <code>Object</code></dt>
<dd><p>Returns the properties of a model</p>
</dd>
<dt><a href="#listen">listen(context, title, callback)</a></dt>
<dd><p>Load a listener</p>
</dd>
<dt><a href="#removeListener">removeListener(listener)</a></dt>
<dd><p>Remove a listener</p>
</dd>
<dt><a href="#announce">announce(context, title, content)</a></dt>
<dd><p>Message one or many listeners</p>
</dd>
</dl>

<a name="model"></a>

#### model(model)
Load a model

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| model | <code>object</code> |  |
| model.name | <code>string</code> | The name of the model |
| model.method | <code>string</code> | One of the following methods name: appendChild, insertBefore, removeElement, updateElement, replaceElement, wrapElement, clearListeners |
| model.properties | <code>Object</code> | Processed properties along with any properties an Element¹ can have |
| [model.callback] | <code>function</code> | Callback of processed properties along with any properties an Element¹ can have |
| [model.properties.children] | <code>Array.&lt;Object&gt;</code> | An array of the "properties" object |

<a name="bind"></a>

#### bind(name, callback)
Link a model to a "binding", that is a callback function

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the model |
| callback | <code>function</code> | The function binding the model |

<a name="runModel"></a>

#### runModel(name, parameters)
Update the DOM accordingly to a model

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the model |
| parameters | <code>Object</code> | The parameters of the model |
| parameters.parentNode | <code>Element</code> | The target Node |
| [parameters.data] | <code>Object</code> | The data that will be echoed on the model |
| [parameters.bindingArgs] | <code>Array</code> | The arguments that go along with the binding |

<a name="createElement"></a>

#### createElement(properties, [callback]) ⇒ <code>Element</code>
Transform a model into one Element

**Kind**: global function
**Returns**: <code>Element</code> - An Element¹

| Param | Type | Description |
| --- | --- | --- |
| properties | <code>object</code> | Processed properties along with any properties a Element can have |
| [callback] | <code>function</code> | Callback version of properties |

<a name="getModelProperties"></a>

#### getModelProperties(name, [data]) ⇒ <code>Object</code>
Returns the properties of a model

**Kind**: global function
**Returns**: <code>Object</code> - The "properties" object of the model

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the model |
| [data] | <code>Object</code> | The data that will be echoed on the model |

<a name="listen"></a>

#### listen(context, title, callback)
Load a listener

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| context | <code>\*</code> | Where the announce will be broadcasted |
| title | <code>string</code> | The content of the message |
| callback | <code>function</code> |  |

<a name="removeListener"></a>

#### removeListener(listener)

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| listener | <code>Object</code> |  |

<a name="announce"></a>

#### announce(context, title, content)
Message one or many listeners

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| context | <code>\*</code> | Where the announce will be broadcasted |
| title | <code>string</code> | The title of the announce |
| content | <code>\*</code> | The content of the announce |

## Common errors

### Cannot set property 'binding' of undefined

UserInterface.js could not find the model specified when calling ``UserInterface.bind``.

### Cannot destructure property 'method' of 'model' as it is undefined.

UserInterface.js could not find the model specified when calling ``UserInterface.runModel``.

[Open an issue](https://github.com/thoughtsunificator/userinterface.js/issues) if you think your issue is not listed above.

## Collection

userinterface.js also provides a [collection](https://github.com/thoughtsunificator/userinterface.js-collection) that contains a few basic models to get you started.

## Extensions

- [userinterface.js-paginator](https://github.com/thoughtsunificator/userinterface.js-paginator)

## Demos

- [userinterface.js-todo](https://github.com/thoughtsunificator/userinterface.js-todo)
- [userinterface.js-suraidaa](https://github.com/thoughtsunificator/userinterface.js-suraidaa)
- [userinterface.js-puissance4](https://github.com/thoughtsunificator/userinterface.js-puissance4)
- [userinterface.js-consoru](https://github.com/thoughtsunificator/userinterface.js-consoru)
- [userinterface.js-calculator](https://github.com/thoughtsunificator/userinterface.js-calculator)
- [userinterface.js-paint](https://github.com/thoughtsunificator/userinterface.js-ms_paint)

## Running the tests

``npm install``

Then simply run ``npm test`` to run the tests