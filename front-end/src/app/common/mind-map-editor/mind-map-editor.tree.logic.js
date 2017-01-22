//import d3 from './mind-map-editor.d3-layout';
const style = `
        .svg-container {
            display: inline-block;
            position: relative;
            width: 100%;
            padding-bottom: 70vh; /* aspect ratio */
            vertical-align: top;
            overflow: hidden;
        }
        .svg-content-responsive {
            display: inline-block;
            position: absolute;
        }
    rect {
        fill: none;
        pointer-events: all;
    }
    line {
        stroke: #000;
        stroke-width: 1.5px;
    }
    .node circle {
        fill: #fff;
        stroke: steelblue;
        stroke-width: 1.5px;
    }
    .node {
        position: relative;
        display: inline-block;
        font: 10px sans-serif;
    }
    .link {
        fill: none;
        stroke: #ccc;
        stroke-width: 1.5px;
    }
    .function-btn {
        opacity: 0;
        -webkit-transition: all 0.5s ease;
        -moz-transition: all 0.5s ease;
        transition: all 0.5s ease;
    }
    .function-btn.add {
        fill: #57D37E;
    }
    .function-btn.remove {
        fill: #E97979;
    }
    .function-btn.edit {
        fill: #79AFE9;
    }
    g:hover > .function-btn {
        opacity: 1;
    }
    .function-bg {
        cursor: pointer;
    }
            `;
export class MindMapEditorTreeLogic {

    constructor(mindMapElement, treeData, settings) {
        this.mindMapElement = mindMapElement;
        this.width = mindMapElement.clientWidth - 120,
        this.height = mindMapElement.clientHeight - 60;

        this.treeData = treeData || {};
        this.tree = d3.layout.tree().size([this.height, this.width]);

        this.diagonal = d3.svg.diagonal().projection((d) => {
            return [d.y, d.x];
        });

        this.zoom = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", () => {
                this.main.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            })

        this.editorContainer = d3.select(this.mindMapElement);
        this.editorSvg = this.editorContainer
            .append("div")
            .classed("svg-container", true)
            .append("svg:svg")
            .attr("width", "100% ")
            .attr("height", "100% ")
            //.attr("viewBox", "0 0 " + this.width + ' ' + this.height)
            .classed("svg-content-responsive", true)
            .call(this.zoom)
            /*.attr("width", this.width + 120)
            .attr("height", this.height + 60);*/

        this.editorSvg.append('style').html(style)


        this.main = this.editorSvg
            .append("svg:g")
            .attr("width", "100% ")
            .attr("height", "100% ")
            .classed('main', true)
            //.attr("transform", "translate(" + 80 + "," + 20 + ")");


        this.nodesData = this.main
            .append("svg:g")
            .attr("width", "100% ")
            .attr("height", "100% ")
            .attr("transform", "translate(" + 80 + "," + 20 + ")");


        this.settings = settings || {
            duration: 500
        };

        window.addEventListener("resize", () => {
            this.width = this.editorSvg.style("width").split('px')[0] - 120,
            this.height = this.editorSvg.style("height").split('px')[0] - 60;
            this.tree = d3.layout.tree().size([this.height, this.width]);
            this.update(this.tree)
        });

        this.onChangeCallback = () => {};
    }


    export(format, scale) {
        let resize = (n) => {
            let cp = d3.select(this.editorSvg.node().cloneNode(true)),
                width = this.width,
                height = this.height,
                m = cp.select('g.main').attr('scale', '(' + n + ')');
            cp
                .attr("width", width)
                .attr("height", height)
                .style("width", width + 'px')
                .style("height", height + 'px')
            return {cp, width, height};
        }
        let save = (dataBlob, filesize) => {
                saveAs.saveAs(dataBlob, this.treeData.name + '.' + format); // FileSaver.js function
        }

        if(format == 'svg') {
            try {
                var isFileSaverSupported = !!new Blob();
            } catch (e) {
                alert("blob not supported");
            }

            var html = this.editorSvg
                .attr("title", this.treeData.name)
                .attr("version", 1.0)
                .attr("xmlns", "http://www.w3.org/2000/svg")
                .node().parentNode.innerHTML;

            var blob = new Blob([html], {type: "image/svg+xml"});
            saveAs.saveAs(blob, this.treeData.name + '.' + format);
        } else if(format == 'pdf') {
            svg_to_pdf(resize(scale).cp.node(), (pdf) => {
                download_pdf(this.treeData.name + + '.pdf', pdf.output('dataurlstring'));
            });
        } else {
            var svgString = getSVGString(resize(scale).cp.node(), this.width, this.height, 8);
            svgString2Image(svgString, 2*this.width, 2*this.height, format, save ); // passes Blob and filesize String to the callback
        }
        

        function getSVGString( svgNode) {
            svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
            var cssStyleText = getCSSStyles( svgNode );

            appendCSS( cssStyleText, svgNode )

            var serializer = new XMLSerializer();
            var svgString = serializer.serializeToString(svgNode);
            svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink=') // Fix root xlink without namespace
            svgString = svgString.replace(/NS\d+:href/g, 'xlink:href') // Safari NS namespace fix

            return svgString;

            function getCSSStyles( parentElement ) {
                var selectorTextArr = [];

                // Add Parent element Id and Classes to the list
                selectorTextArr.push( '#'+parentElement.id );
                for (var c = 0; c < parentElement.classList.length; c++)
                        if ( !contains('.'+parentElement.classList[c], selectorTextArr) )
                            selectorTextArr.push( '.'+parentElement.classList[c] );

                // Add Children element Ids and Classes to the list
                var nodes = parentElement.getElementsByTagName("*");
                for (var i = 0; i < nodes.length; i++) {
                    var id = nodes[i].id;
                    if ( !contains('#'+id, selectorTextArr) )
                        selectorTextArr.push( '#'+id );

                    var classes = nodes[i].classList;
                    for (var c = 0; c < classes.length; c++)
                        if ( !contains('.'+classes[c], selectorTextArr) )
                            selectorTextArr.push( '.'+classes[c] );
                }

                // Extract CSS Rules
                var extractedCSSText = "";
                for (var i = 0; i < document.styleSheets.length; i++) {
                    var s = document.styleSheets[i];
                    
                    try {
                        if(!s.cssRules) continue;
                    } catch( e ) {
                            if(e.name !== 'SecurityError') throw e; // for Firefox
                            continue;
                        }

                    var cssRules = s.cssRules;
                    for (var r = 0; r < cssRules.length; r++) {
                        if ( contains( cssRules[r].selectorText, selectorTextArr ) )
                            extractedCSSText += cssRules[r].cssText;
                    }
                }
                return extractedCSSText

                function contains(str,arr) {
                    return arr.indexOf( str ) === -1 ? false : true;
                }

            }

            function appendCSS( cssText, element ) {
                var styleElement = document.createElement("style");
                styleElement.setAttribute("type","text/css"); 
                styleElement.innerHTML = cssText;
                var refNode = element.hasChildNodes() ? element.children[0] : null;
                element.insertBefore( styleElement, refNode );
            }
        }


        function svgString2Image( svgString, width, height, format, callback ) {
            var format = format ? format : 'png';
            var imgsrc = 'data:image/svg+xml;base64,'+ btoa( unescape( encodeURIComponent( svgString ) ) ); // Convert SVG string to dataurl

            var canvas = document.createElement("canvas");
            var context = canvas.getContext("2d");

            canvas.width = width;
            canvas.height = height;
            //document.body.append(canvas);

            var image = new Image;
            image.onload = function() {
                context.clearRect ( 0, 0, width, height );
                context.drawImage(image, 0, 0, width, height);

                canvas.toBlob( function(blob) {
                    var filesize = Math.round( blob.length/1024 ) + ' KB';
                    if ( callback ) callback( blob, filesize );
                });
            };

            image.src = imgsrc;
        }

        function svg_to_pdf(svg, callback) {
             saveSvgAsPng.svgAsDataUri(svg, {}, function(svg_uri) {
                var image = document.createElement('img');

                image.src = svg_uri;
                image.onload = function() {
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');
                    var doc = new jsPDF('portrait', 'pt');
                    var dataUrl;

                    canvas.width = image.height + image.width;
                    canvas.height = image.height + image.width;
                    if(image.height < image.width){
                        context.rotate((90)*Math.PI/180);
                    } 

                    

                    //context.translate(canvas.width/2,canvas.height/2);
                    //context.rotate((90)*Math.PI/180);
                    //context.drawImage(image,-image.width/2,-image.width/2);
                    context.drawImage(image, 0, 0, image.width, image.height);
                    dataUrl = canvas.toDataURL('image/png');
                    doc.addImage(dataUrl, 'PNG', 0, 0, image.width, image.height);

                    callback(doc);
                }
            });
        }

        
        function download_pdf(name, dataUriString) {
            var link = document.createElement('a');
            link.addEventListener('click', function(ev) {
                link.href = dataUriString;
                link.download = name;
                document.body.removeChild(link);
            }, false);
            document.body.appendChild(link);
            link.click();
        }

        
    }

    onChange(cb) {
        this.onChangeCallback = cb;
    }

    setDataApi(dataApi) {
        this.dataApi = dataApi;
    }

    setTreeData(treeData) {
        this.treeData = treeData || this.treeData;
        this.treeData.x0 = this.height / 2;
        this.treeData.y0 = 0;
        this.update(this.treeData, true);
        return this.treeData;
    }

    getTreeData() {
        return this.treeData;
    }

    toggleChildren(d) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        } else {
            d.children = d._children;
            d._children = null;
        }
    }

    toggleChildrenAll(d) {
        if (d.children) {
            d.children.forEach(toggleChildrenAll);
            this.toggleChildren(d);
        }
    }

    update(source, flag) {
        if (!(source != null)) {
            return;
        }

        // Compute the new tree layout.
        const nodes = this.tree.nodes(this.treeData).reverse();


        // Normalize for fixed-depth.             
        let deepest = 0,
            generationGutter = this.width;

        nodes.forEach((d) => {
            if (deepest < d.depth) {
                deepest = d.depth;
            }
        });
        generationGutter = Math.floor(this.width / (deepest + 1));
        nodes.forEach((d) => { d.y = d.depth * generationGutter; });

        // Update the nodes…
        var node = this.nodesData.selectAll("g.node")
            .data(nodes, (d) => {
                return d.id || (d.id = (new Date()).getTime());
            });

        // Enter any new nodes at the parent's previous position.
        var nodeEnter = node.enter().append("svg:g")
            .attr("class", "node")
            .attr("transform", (d) => {
                return "translate(" + source.y0 + "," + source.x0 + ")";
            });

        //inject content to node
        this.InjectNodeContent(nodeEnter);

        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(this.settings.duration)
            .attr("transform", (d) => {
                return "translate(" + d.y + "," + d.x + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", (d) => {
                return 9.5 - d.depth;
            })
            .style("fill", (d) => {
                return d._children ? "lightsteelblue" : "#fff";
            });

        nodeUpdate.select("text")
            .text((d) => {
                return d.value.name;
            })
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(this.settings.duration)
            .attr("transform", (d) => {
                return "translate(" + source.y + "," + source.x + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = this.nodesData.selectAll("path.link")
            .data(this.tree.links(nodes), (d) => {
                return d.target.id;
            });

        // Enter any new links at the parent's previous position.
        

        link.enter()
            .insert("svg:path", "g")
            .attr('stroke-width', 10)
            .attr("class", "link")
            .attr('id', (d) => {
                return d.source.id + '-' + d.target.id;
            })
            .attr("d", (d) => {
                var o = { x: source.x0, y: source.y0 };
                return this.diagonal({ source: o, target: o });
            })
            .transition()
            .duration(this.settings.duration)
            .attr("d", this.diagonal);

        // Transition links to their new position.
        link.transition()
            .duration(this.settings.duration)
            .attr("d", this.diagonal);

        link.enter()
            .insert("svg:text", "g")
            .attr("text-anchor", "middle")
            .style('font-size', '14px')

            .append("textPath")
            .attr('startOffset', '50%')
            .text((d) => {
                return d.target.connection.name + (d.target.subConnection && d.target.subConnection.name || '');
            })
            .attr("href", (d) => {
                return "#" + d.source.id + '-' + d.target.id
            })
            .text((d) => {
                return d.target.connection.name;
            });

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(this.settings.duration)
            .attr("d", (d) => {
                var o = { x: source.x, y: source.y };
                return this.diagonal({ source: o, target: o });
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach((d) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        if (!flag) {
            this.onChangeCallback(this.treeData);
        }
    }


    InjectNodeContent(nodeEnter) {
        nodeEnter.append("svg:circle")
            .attr("r", 1e-6)
            .style("fill", (d) => {
                return d._children ? "lightsteelblue" : "#fff";
            })
            .classed("toggleCircle", true)
            .on("click", (d) => {
                toggle(d);
                update(d);
            });

        nodeEnter.append("svg:text")
            .attr("x", (d) => {
                return d.children || d._children ? -10 : 10;
            })
            .style('font-size', '14px')
            .attr("dy", ".35em")
            .attr("text-anchor", (d) => {
                return d.children || d._children ? "end" : "start";
            })
            .text((d) => {
                return d.value.name;
            })
            .style("fill-opacity", 1e-6);

        // Add btn icon
        nodeEnter.append("svg:path")
            .attr("d", "M12 24c-6.627 0-12-5.372-12-12s5.373-12 12-12c6.628 0 12 5.372 12 12s-5.372 12-12 12zM12 3c-4.97 0-9 4.030-9 9s4.030 9 9 9c4.971 0 9-4.030 9-9s-4.029-9-9-9zM13.5 18h-3v-4.5h-4.5v-3h4.5v-4.5h3v4.5h4.5v3h-4.5v4.5z")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -70 : 0;
                return "translate(" + offset + "," + 10 + ")";
            })
            .classed("function-btn add", true);

        nodeEnter.append("svg:rect")
            .classed("function-bg add", true)
            .attr("width", "24px")
            .attr("height", "24px")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -70 : 0;
                return "translate(" + offset + "," + 10 + ")";
            })
            .on("click", this.addNewNode.bind(this));

        // Remove btn icon
        nodeEnter.append("svg:path")
            .attr("d", "M3.514 20.485c-4.686-4.686-4.686-12.284 0-16.97 4.688-4.686 12.284-4.686 16.972 0 4.686 4.686 4.686 12.284 0 16.97-4.688 4.687-12.284 4.687-16.972 0zM18.365 5.636c-3.516-3.515-9.214-3.515-12.728 0-3.516 3.515-3.516 9.213 0 12.728 3.514 3.515 9.213 3.515 12.728 0 3.514-3.515 3.514-9.213 0-12.728zM8.818 17.303l-2.121-2.122 3.182-3.182-3.182-3.182 2.121-2.122 3.182 3.182 3.182-3.182 2.121 2.122-3.182 3.182 3.182 3.182-2.121 2.122-3.182-3.182-3.182 3.182z")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -40 : 30;
                return "translate(" + offset + "," + 10 + ")";
            })
            .classed("function-btn remove", true);

        nodeEnter.append("svg:rect")
            .classed("function-bg remove", true)
            .attr("width", "24px")
            .attr("height", "24px")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -40 : 30;
                return "translate(" + offset + "," + 10 + ")";
            })
            .on("click", this.removeNode.bind(this));

        // Edit btn
        nodeEnter.append("svg:path")
            .attr("d", "M20.307 1.998c-0.839-0.462-3.15-1.601-4.658-1.913-1.566-0.325-3.897 5.79-4.638 5.817-1.202 0.043-0.146-4.175 0.996-5.902-1.782 1.19-4.948 2.788-5.689 4.625-1.432 3.551 2.654 9.942 0.474 10.309-0.68 0.114-2.562-4.407-3.051-5.787-1.381 2.64-0.341 5.111 0.801 8.198v0.192c-0.044 0.167-0.082 0.327-0.121 0.489h0.121v4.48c0 0.825 0.668 1.493 1.493 1.493 0.825 0 1.493-0.668 1.493-1.493v-4.527c2.787-0.314 4.098 0.6 6.007-3.020-1.165 0.482-3.491-0.987-3.009-1.68 0.97-1.396 4.935 0.079 7.462-4.211-4 1.066-4.473-0.462-4.511-1.019-0.080-1.154 3.999-0.542 5.858-2.146 1.078-0.93 2.37-3.133 0.97-3.905z")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -10 : 60;
                return "translate(" + offset + "," + 10 + ")";
            })
            .classed("function-btn edit", true);

        nodeEnter.append("svg:rect")
            .classed("function-bg edit", true)
            .attr("width", "24px")
            .attr("height", "24px")
            .attr("transform", (d) => {
                var offset = (d.children || d._children) ? -10 : 60;
                return "translate(" + offset + "," + 10 + ")";
            })
            .on("click", this.editNode.bind(this));
    }

    addNewNode(d) {
        let childList;
        if (d.children) {
            childList = d.children;
        } else if (d._children) {
            childList = d.children = d._children;
            d._children = null;
        } else {
            childList = [];
            d.children = childList;
        }
        if (this.dataApi && this.dataApi.add) {
            this.dataApi.add(d).then((response) => {
                childList.push(Object.assign({
                    "depth": d.depth + 1,
                    "parent": d
                }, response));
                this.update(d);
            }, () => {
                this.update(d);
            })
        }
        
    }

    removeNode(d) {
        let thisId = d.id;
        if (!d.parent) {
            return;
        }
        if (this.dataApi && this.dataApi.remove) {
            this.dataApi.remove(d).then((response) => {
                if (!response) {
                    return;
                }
                d.parent.children.forEach((c, index) => {
                    if (thisId === c.id) {
                        d.parent.children.splice(index, 1);
                        return;
                    }
                });
                this.update(d.parent);
            }, () => {
                this.update(d);
            })
        }
    }

    editNode(d) {
        if (this.dataApi && this.dataApi.edit) {
            this.dataApi.edit(d).then((response) => {
                Object.assign(d, response);
                if (!d.parent) {
                    this.update(d);
                } else {
                    this.update(d.parent);
                }
            }, () => {
                this.update(d);
            })
        }
    }
}
