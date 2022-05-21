// use a V figure instead of MinusLine in the TreeExpanderButton
 go.Shape.defineFigureGenerator("ExpandedLine", (shape, w, h) => {
    return new go.Geometry()
          .add(new go.PathFigure(0, 0.25*h, false)
                .add(new go.PathSegment(go.PathSegment.Line, .5 * w, 0.75*h))
                .add(new go.PathSegment(go.PathSegment.Line, w, 0.25*h)));
  });

  // use a sideways V figure instead of PlusLine in the TreeExpanderButton
  go.Shape.defineFigureGenerator("CollapsedLine", (shape, w, h) => {
    return new go.Geometry()
          .add(new go.PathFigure(0.25*w, 0, false)
                .add(new go.PathSegment(go.PathSegment.Line, 0.75*w, .5 * h))
                .add(new go.PathSegment(go.PathSegment.Line, 0.25*w, h)));
  });

  function init() {

    // Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
    // For details, see https://gojs.net/latest/intro/buildingObjects.html
    const $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
      $(go.Diagram, "myDiagramDiv",
        {
          allowMove: false,
          allowCopy: false,
          allowDelete: false,
          allowHorizontalScroll: false,
          layout:
            $(go.TreeLayout,
              {
                alignment: go.TreeLayout.AlignmentStart,
                angle: 0,
                compaction: go.TreeLayout.CompactionNone,
                layerSpacing: 16,
                layerSpacingParentOverlap: 1,
                nodeIndentPastParent: 1.0,
                nodeSpacing: 0,
                setsPortSpot: false,
                setsChildPortSpot: false
              })
        });

    myDiagram.nodeTemplate =
      $(go.Node,
        { // no Adornment: instead change panel background color by binding to Node.isSelected
          selectionAdorned: false,
          // a custom function to allow expanding/collapsing on double-click
          // this uses similar logic to a TreeExpanderButton
          doubleClick: (e, node) => {
            var cmd = myDiagram.commandHandler;
            if (node.isTreeExpanded) {
              if (!cmd.canCollapseTree(node)) return;
            } else {
              if (!cmd.canExpandTree(node)) return;
            }
            e.handled = true;
            if (node.isTreeExpanded) {
              cmd.collapseTree(node);
            } else {
              cmd.expandTree(node);
            }
          }
        },
        $("TreeExpanderButton",
          { // customize the button's appearance
            "_treeExpandedFigure": "ExpandedLine",
            "_treeCollapsedFigure": "CollapsedLine",
            "ButtonBorder.fill": "whitesmoke",
            "ButtonBorder.stroke": null,
            "_buttonFillOver": "rgba(0,128,255,0.25)",
            "_buttonStrokeOver": null
          }),
        $(go.Panel, "Horizontal",
          { position: new go.Point(18, 0) },
          new go.Binding("background", "isSelected", s => s ? "lightblue" : "transparent").ofObject(),
          $(go.Picture,
            {              
              width: 18, height: 18,              
              margin: new go.Margin(0, 4, 0, 0),
              imageStretch: go.GraphObject.Uniform,

            },
            // bind the picture source on two properties of the Node
            // to display open folder, closed folder, or document
            new go.Binding("source", "isTreeExpanded", imageConverter).ofObject(),
            new go.Binding("source", "isTreeLeaf", imageConverter).ofObject()),
          $(go.TextBlock,
            { font: '15pt Verdana, sans-serif'},
            new go.Binding("text", "key", s => s))
        )  // end Horizontal Panel
      );  // end Node

    // without lines
    myDiagram.linkTemplate = $(go.Link);

    

    // create a tree
    
    fetch("http://localhost:3000/api/cities")
      .then(res => res.json())
      .then(data => {
        var nodeDataArray = [{ key: "Türkiye" }];
        data.data.forEach(element => {
          nodeDataArray.push({ key: element.il_adi, parent: "Türkiye" });
          if (element.ilceler) {
            element.ilceler.forEach(ilce => {
              nodeDataArray.push({ key: ilce.ilce_adi, parent: element.il_adi });
            });
          }
        });
        myDiagram.model = new go.TreeModel(nodeDataArray);
      });
    
  }


  // takes a property change on either isTreeLeaf or isTreeExpanded and selects the correct image to use
  function imageConverter(prop, picture) {
    var node = picture.part;
    if (node.isTreeLeaf) {
      return "../images/document.svg";
    } else {
      if (node.isTreeExpanded) {
        return "../images/openFolder.svg";
      } else {
        return "../images/closedFolder.svg";
      }
    }
}
  window.addEventListener('DOMContentLoaded', init);
