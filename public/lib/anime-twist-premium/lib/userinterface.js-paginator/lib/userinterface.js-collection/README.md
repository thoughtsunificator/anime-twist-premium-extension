# userinterface.js-collection [![Build Status](https://travis-ci.com/thoughtsunificator/userinterface.js-collection.svg?branch=master)](https://travis-ci.com/thoughtsunificator/userinterface.js-collection)

userinterface.js-collection is a collection of UI elements to help build your UI. In this collection you will find ready to use tabs, input, button etc.

## Summary
- [Getting started](#getting-started)
	- [Prerequisites](#prerequisites)
	- [Installing](#installing)
	- [Usage](#usage)
- [Collection](#collection)
	- [Control](#control)
		- [Button](#collectionbutton)
		- [Input](#collectioninput)
		- [Input Color](#collectioninput_color)
		- [Input File](#collectioninput_file)
		- [Control](#collection)
		- [Label Checkbox](#collectionlabel_checkbox)
		- [Label Radio](#collectionlabel_radio)
		- [Control](#collection)
		- [Popup](#collectionpopup)
			- [Form](#collectionpopup_form)
			- [Confirm](#collectionpopup_confirm)
			- [Controls](#collectionpopup_controls)
		- [Resizable](#collectionresizable)
		- [Select](#collectionselect)
		- [Tab](#collectiontab)
- [Running the tests](#running-the-tests)

## Getting Started

### Prerequisites

- [userinterface.js](https://github.com/thoughtsunificator/userinterface.js)

### Installing

Run ```git submodule add https://github.com/thoughtsunificator/userinterface.js-collection.git lib/userinterface.js-collection``` at the root of your project.

userinterface.js-collection should be located in the `lib/` folder at the root of your project.

### Usage

```html
<!DOCTYPE html>
<html>
<head>
	<script src="./lib/userinterface.js/src/userinterface.js" type="text/javascript"></script>
	<script src="./lib/userinterface.js-collection/userinterface/button.js" type="text/javascript"></script>
</head>
<body>
<noscript>
	This feature requires JavaScript to be enabled.
</noscript>
<script>
	const application = {}
	UserInterface.runModel("collection.button", {
		parentNode: document.body,
		bindingArgs: [application, { action: "foo" }],
		data: { text: "Button #1" }
	})
</script>
</body>
</html>
```

## Collection

### Control

Controls are a type of element that when interacted with emit a certain event to a given context.

Controls models are hackable. You can pass ``style`` and ``className`` (or any other property) to customize the look of the model through the ``data`` parameter.

````javascript
UserInterface.runModel("collection.button", {
	parentNode: document.body,
	bindingArgs: [application, { action: "foo" }],
	data: { text: "Button #1", className: "myButton" }
})
````

#### collection.button

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event
- ```value``` ``*``        The value that will be passed to the event listeners
- ```active``` ``boolean`` If true the button will be set to active when a certain event is announced.

Usage:
````javascript
UserInterface.runModel("collection.button", {
	parentNode: document.body,
	bindingArgs: [application, { value: "somevalue", action: "toggle", active: false }],
	data: { text: "" }
})
````

#### collection.input

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event

Usage:
````javascript
UserInterface.runModel("collection.input", {
	parentNode: document.body,
	bindingArgs: [application, { action: "addText" }],
	data: { type: "text", value: ""}
})
````

#### collection.input_color

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event

Usage:
````javascript
UserInterface.runModel("collection.input_color", {
	parentNode: document.body,
	bindingArgs: [application, { action: "set color" }],
	data: { value: "#FFFFFF"}
})
````

#### collection.input_file

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event

Usage:
````javascript
UserInterface.runModel("collection.input_file", {
	parentNode: document.body,
	bindingArgs: [application, { action: "uploadFile" }]
})
````

#### collection.label_checkbox

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String`` The name of the event

Usage:
````javascript
UserInterface.runModel("collection.label_checkbox", {
	parentNode: document.body,
	bindingArgs: [application, { action: "setSomething" }],
	data: { text: "Test" }
})
````

#### collection.label_radio

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String`` The name of the event

Usage:
````javascript
UserInterface.runModel("collection.label_radio", {
	parentNode: document.body,
	bindingArgs: [application, { action: "setSomething" }],
	data: { text: "Test" }
})
````

### collection.popup

Binding Prototype: ```function(* application, Control control)```

Usage:
````javascript
UserInterface.runModel("collection.popup", {
	parentNode: document.body,
	bindingArgs: [application]
})
````

Once the main popup is ran all you need to do to get ``form``, ``controls`` or ``confirm`` is to send the ``popup confirm|form|controls open`` event through the ``application`` object that you passed earlier. See below for more details.

#### collection.popup_confirm

- ```eventYes``` ``String`` The name of the event to be announced when clicking yes
- ```eventNo```  ``String`` The name of the event to be announced when clicking no
- ```data```     ``object`` Data to pass along when announcing the event

Usage:
````javascript
UserInterface.announce(application, "popup confirm open", {
	eventYes: "foo",
	eventNo: "bar",
	data: { /* whatever data you want to pass along to the foo event */ },
	text: "Are you sure?"
})
````

#### collection.popup_form

A simple form inside a popup, whenver submitted sent a given event.

When listening to the given event, fields can be retrieved through ``data.form`` object as well as further data using ``data.data`` object.

- ```model```  ``String`` The name of the tab that will be passed to the event listeners
- ```action``` ``String`` The name of the event
- ```form```   ``object`` identifier and value of the elements you wants to prepopulate
- ```data```   ``object`` Data that should be sent when submitting the form

Usage:
````javascript
UserInterface.announce(application, "popup form open", {
	model: "model",
	action: "create",
	form: { /* whatever field you want to prepopulate */ },
	data: { /* whatever data you want to pass along to the create event */ },
})
````

#### collection.popup_controls

A list of controls inside a popup.

You can easily add controls in form of a popup by combining ``collection.popup_controls`` with models like ``collection.button`` and such...

- ```controls``` ``Control[]``  A list of controls that will be displayed inside the popup

Any object inside the array is a Control object so it could be passed to any model that expect a Control object its its ``bindingArgs``.

For example, in this case we will be creating a button that will send the ``hello`` event whenever clicked.

Usage:
````javascript
UserInterface.announce(application, "popup controls open", [
	{
		model: "collection.button",
		text: "Your text",
		action: "hello",
		// here we can also pass any property that collection.button would expect.
	}
])
````

#### collection.resizable

![demo](https://i.imgur.com/4Jodoue.gif)

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```directions``` ``array``  Can be horizontal, diagonal, vertical or all three.
- ```preview```    ``boolean``  If true, will show a selection rectangle that moves indicating the new size of the target

``targetElement`` being the element that you want to be resizable.

Usage:
````javascript
UserInterface.runModel("collection.resizable", {
	parentNode: targetElement,
	bindingArgs: [application, ["horizontal", "vertical", "diagonal"]]
})
````

#### collection.select

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event

Usage:
````javascript
UserInterface.runModel("collection.select", {
	parentNode: document.body,
	bindingArgs: [application, { action: "setSomething" }],
	data: { options }
})
````

#### collection.tab

Binding Prototype: ```function(* application, Control control)```

Parameters:
- ```action``` ``String``  The name of the event
- ```name```   ``String`` The name of the tab that will be passed to the event listeners.

Parameters:
- ```toggle``` ``boolean`` If true the event will be announced even if the tab is already selected.

Usage:
````javascript
UserInterface.runModel("collection.tab", {
	parentNode: document.body,
	bindingArgs: [application, { action: "tab set" }],
	data: { name: "" }
})
````

## Running the tests

Run ``npm install``

Then simply run ``npm test`` to run the tests.