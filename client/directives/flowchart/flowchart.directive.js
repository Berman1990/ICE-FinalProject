angular.module('myApp.level.chart', [])
    .directive('goDiagram', function() {
        return {
            restrict: 'E',
            templateUrl: 'directives/flowchart/flowchart.directive.html',
            replace: true,
            scope: { model: '=goModel' },
            link: function(scope, element, attrs) {
                var $ = go.GraphObject.make;

                // init diagram div
                var myDiagram =
                    $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
                        {
                            initialContentAlignment: go.Spot.Center,
                            allowDrop: true, // must be true to accept drops from the Palette
                            "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
                            "LinkRelinked": showLinkLabel,
                            "animationManager.duration": 800, // slightly longer than default (600ms) animation
                            "undoManager.isEnabled": true, // enable undo & redo
                            "ModelChanged": updateAngular
                        });


                // whenever a GoJS transaction has finished modifying the model, update all Angular bindings
                function updateAngular(e) {
                    if (e.isTransactionFinished) {
                        scope.$apply();
                    }
                }

                // Make link labels visible if coming out of a "conditional" node.
                // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
                function showLinkLabel(e) {
                    var label = e.subject.findObject("LABEL");
                    if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
                }

                // notice when the value of "model" changes: update the Diagram.model
                scope.$watch("model", function(newmodel) {
                    var oldmodel = myDiagram.model;
                    if (oldmodel !== newmodel) {
                        myDiagram.model = newmodel;
                        console.log('changed');
                    }
                });

                //       scope.$watch("model.selectedNodeData.name", function(newname) {
                //         // disable recursive updates
                //         diagram.removeModelChangedListener(updateAngular);
                //         // change the name
                //         diagram.startTransaction("change name");
                //         // the data property has already been modified, so setDataProperty would have no effect
                //         var node = diagram.findNodeForData(diagram.model.selectedNodeData);
                //         if (node !== null) node.updateTargetBindings("name");
                //         diagram.commitTransaction("change name");
                //         // re-enable normal updates
                //         diagram.addModelChangedListener(updateAngular);
                //       });

                // update the model when the selection changes
                myDiagram.addDiagramListener("ChangedSelection", function(e) {
                    var selnode = myDiagram.selection.first();
                    myDiagram.model.selectedNodeData = (selnode instanceof go.Node ? selnode.data : null);
                    scope.$apply();
                });

                // when the document is modified, add a "*" to the title and enable the "Save" button
                myDiagram.addDiagramListener("Modified", function(e) {
                    // var button = document.getElementById("SaveButton");
                    // if (button) button.disabled = !myDiagram.isModified;
                    var idx = document.title.indexOf("*");
                    if (myDiagram.isModified) {
                        if (idx < 0) document.title += "*";
                    } else {
                        if (idx >= 0) document.title = document.title.substr(0, idx);
                    }
                    myDiagram.model.isModified = myDiagram.isModified;
                    scope.$apply();
                });


                // helper definitions for node templates
                function nodeStyle() {
                    return [
                        // The Node.location comes from the "loc" property of the node data,
                        // converted by the Point.parse static method.
                        // If the Node.location is changed, it updates the "loc" property of the node data,
                        // converting back using the Point.stringify static method.
                        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify), {
                            // the Node.location is at the center of each node
                            locationSpot: go.Spot.Center,
                            //isShadowed: true,
                            //shadowColor: "#888",
                            // handle mouse enter/leave events to show/hide the ports
                            mouseEnter: function(e, obj) { showPorts(obj.part, true); },
                            mouseLeave: function(e, obj) { showPorts(obj.part, false); }
                        }
                    ];
                }

                // Define a function for creating a "port" that is normally transparent.
                // The "name" is used as the GraphObject.portId, the "spot" is used to control how links connect
                // and where the port is positioned on the node, and the boolean "output" and "input" arguments
                // control whether the user can draw links from or to the port.
                function makePort(name, spot, output, input) {
                    // the port is basically just a small circle that has a white stroke when it is made visible
                    return $(go.Shape, "Circle", {
                        fill: "transparent",
                        stroke: null, // this is changed to "white" in the showPorts function
                        desiredSize: new go.Size(8, 8),
                        alignment: spot,
                        alignmentFocus: spot, // align the port on the main Shape
                        portId: name, // declare this object to be a "port"
                        fromSpot: spot,
                        toSpot: spot, // declare where links may connect at this port
                        fromLinkable: output,
                        toLinkable: input, // declare whether the user may draw links to/from here
                        cursor: "pointer" // show a different cursor to indicate potential link point
                    });
                }

                // Make all ports on a node visible when the mouse is over the node
                function showPorts(node, show) {
                    var diagram = node.diagram;
                    if (!diagram || diagram.isReadOnly || !diagram.allowLink) return;
                    node.ports.each(function(port) {
                        port.stroke = (show ? "white" : null);
                    });
                }

                var lightText = 'whitesmoke';

                myDiagram.nodeTemplateMap.add("Empty", // the default category
                    $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                            $(go.Shape, "Rectangle", { minSize: new go.Size(40, 60), fill: "#FFFFFF", stroke: null },
                                new go.Binding("figure", "figure"),
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),
                            $(go.TextBlock, {
                                    font: "bold 11pt Helvetica, Arial, sans-serif",
                                    stroke: lightText,
                                    margin: 8,
                                    maxSize: new go.Size(160, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: false
                                },
                                new go.Binding("text").makeTwoWay())
                        )

                    ));

                myDiagram.nodeTemplateMap.add("", // the default category
                    $(go.Node, "Spot", nodeStyle(),
                        // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                        $(go.Panel, "Auto",
                            $(go.Shape, "RoundedRectangle", { fill: "#00A9C9", stroke: null },
                                new go.Binding("figure", "figure"),
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),
                            $(go.TextBlock, {
                                    font: "bold 11pt Helvetica, Arial, sans-serif",
                                    stroke: lightText,
                                    margin: 8,
                                    maxSize: new go.Size(160, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    editable: true
                                },
                                new go.Binding("text").makeTwoWay())
                        ),
                        // four named ports, one on each side:
                        makePort("T", go.Spot.Top, false, true),
                        makePort("L", go.Spot.Left, true, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                    ));

                myDiagram.nodeTemplateMap.add("Start",
                    $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Shape, "TriangleDown", { minSize: new go.Size(50, 50), fill: "#79C900", stroke: null },
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),
                            $(go.TextBlock, "Start", { font: "bold 12pt Helvetica, Arial, sans-serif", stroke: lightText },
                                new go.Binding("text"))
                        ),
                        makePort("B", go.Spot.Bottom, true, false)
                    ));

                myDiagram.nodeTemplateMap.add("End",
                    $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Shape, "Spade", { minSize: new go.Size(50, 50), fill: "#DC3C00", stroke: null },
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),
                            $(go.TextBlock, "End", { font: "bold 11pt Helvetica, Arial, sans-serif", stroke: lightText },
                                new go.Binding("text"))
                        ),
                        // three named ports, one on each side except the bottom, all input only:
                        makePort("T", go.Spot.Top, false, true)

                    ));

                myDiagram.nodeTemplateMap.add("Loop",
                    $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Picture, { source: "images/loop.png",
                                width: 70, height: 70 }),
                        //    $(go.Picture,{ "images\\loop.png", column: 3,
                          //                   width: 50, height: 32.5, margin: 2 )},
                            /*$(go.Shape, "NorGate", { minSize: new go.Size(50, 60), fill: "#79C900", stroke: null },
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),*/
                            $(go.TextBlock, {
                                    margin: 5,
                                    maxSize: new go.Size(200, NaN),
                                    wrap: go.TextBlock.WrapFit,
                                    textAlign: "center",
                                    editable: true,
                                    font: "bold 12pt Helvetica, Arial, sans-serif",
                                    stroke: '#454545'
                                },
                                new go.Binding("text", "times").makeTwoWay())
                        ),
                        makePort("T", go.Spot.Top, false, true),
                        makePort("R", go.Spot.Right, true, true),
                        makePort("B", go.Spot.Bottom, true, false)
                    ));

                myDiagram.nodeTemplateMap.add("Turn",
                    $(go.Node, "Spot", nodeStyle(),
                        $(go.Panel, "Auto",
                            $(go.Shape, "RoundedRectangle", { minSize: new go.Size(60, 50), fill: "#00A9C9", stroke: null },
                                new go.Binding("stroke", "isHighlighted", function(h) {
                                    return h ? "red" : "black"; })
                                .ofObject(),
                                new go.Binding("strokeWidth", "isHighlighted", function(h) {
                                    return h ? 3 : 1; })
                                .ofObject()),
                            $(go.TextBlock, "Start", { font: "bold 12pt Helvetica, Arial, sans-serif", stroke: lightText },
                                new go.Binding("text"))
                        ),
                        makePort("T", go.Spot.Top, false, true),
                        makePort("B", go.Spot.Bottom, true, false)
                    ));



                myDiagram.nodeTemplateMap.add("Comment",
                    $(go.Node, "Auto", nodeStyle(),
                        $(go.Shape, "File", { fill: "#EFFAB4", stroke: null }),
                        $(go.TextBlock, {
                                margin: 5,
                                maxSize: new go.Size(100, NaN),
                                wrap: go.TextBlock.WrapFit,
                                textAlign: "center",
                                editable: true,
                                font: "bold 12pt Helvetica, Arial, sans-serif",
                                stroke: '#454545'
                            },
                            new go.Binding("text").makeTwoWay())
                        // no ports, because no links are allowed to connect with a comment
                    ));

                scope.model.getJson = function() {
                    return myDiagram.model.toJson();

                }

                scope.model.highlightNodeByKey = function(nodeKey, DoClear) {
                    var node = myDiagram.findNodeForKey(nodeKey);
                    var diagram = node.diagram;
                    diagram.startTransaction("highlight");

                    if(DoClear) {
                        diagram.clearHighlighteds();
                    }

                    node.isHighlighted = true;

                    //diagram.commitTransaction("highlight");
                }

                myDiagram.click = function(e) {
                    myDiagram.startTransaction("no highlighteds");
                    myDiagram.clearHighlighteds();
                    myDiagram.commitTransaction("no highlighteds");
                };

                // replace the default Link template in the linkTemplateMap
                myDiagram.linkTemplate =
                    $(go.Link, // the whole link panel
                        {
                            routing: go.Link.AvoidsNodes,
                            curve: go.Link.JumpOver,
                            corner: 5,
                            toShortLength: 4,
                            relinkableFrom: true,
                            relinkableTo: true,
                            reshapable: true,
                            resegmentable: true,
                            // mouse-overs subtly highlight links:
                            mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)"; },
                            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; }
                        },
                        new go.Binding("points").makeTwoWay(),
                        $(go.Shape, // the highlight shape, normally transparent
                            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
                        $(go.Shape, // the link path shape
                            { isPanelMain: true, stroke: "gray", strokeWidth: 2 }),
                        $(go.Shape, // the arrowhead
                            { toArrow: "standard", stroke: null, fill: "gray" }),
                        $(go.Panel, "Auto", // the link label, normally not visible
                            { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
                            new go.Binding("visible", "visible").makeTwoWay(),
                            $(go.Shape, "RoundedRectangle", // the label shape
                                { fill: "#F8F8F8", stroke: null }),
                            $(go.TextBlock, "Yes", // the label
                                {
                                    textAlign: "center",
                                    font: "10pt helvetica, arial, sans-serif",
                                    stroke: "#333333",
                                    editable: true
                                },
                                new go.Binding("text").makeTwoWay())
                        )
                    );

                // Make link labels visible if coming out of a "conditional" node.
                // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
                function showLinkLabel(e) {
                    var label = e.subject.findObject("LABEL");
                    if (label !== null) label.visible = (e.subject.fromNode.data.figure === "Diamond");
                }

                // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
                myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
                myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;

                // initialize the Palette that is on the left side of the page
                myPalette =
                    $(go.Palette, "myPaletteDiv", // must name or refer to the DIV HTML element
                        {
                            "animationManager.duration": 800, // slightly longer than default (600ms) animation
                            nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by myDiagram
                            model: new go.GraphLinksModel([ // specify the contents of the Palette

                                { category: "Empty", text: "" },
                                
                                { key: "K", category: "Loop", times: "3", text: "Loop" },
                                { key: "R", category: "Turn", text: "Right" },
                                { key: "L", category: "Turn", text: "Left " },
                                { key: "F", category: "Turn", text: "Step" },

                                { category: "Comment", text: "Comment" }
                            ])
                        });
            }
        };
    });
