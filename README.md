# NetworkedPainting
A collaborative painting app that allows you to paint on a canvas with another person over the network.

------------------
CONTROLs :
------------------

Input Remote IP, Remote Port and Local Port to connect.

Use:
MouseMoved – to Draw
MouseDragged – to Randomise Brush Color
KeyIsDown 'Del' – to Clear Canvas
KeyIsDown 'Alt' – to Toggle Eraser

------------------
MSG Send over OSC :
------------------

'/brushPosition' number
Brush/Mouse Position (mouseX, mouseY, pmouseX, pmouseY)

'/brushStroke' number
Stroke Weight

'/brushColor' number
HSB Value

'/clearStatus' number
Clear Canvas

'/altStatus' number
Toggle Eraser

