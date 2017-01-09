//import d3 from './mind-map-editor.d3-layout';

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

        this.editorContainer = d3.select(this.mindMapElement);
        this.editorSvg = this.editorContainer
            .append("div")
            .classed("svg-container", true)
            .append("svg:svg")
            .attr("width", "100% ")
            .attr("height", "100% ")
            //.attr("viewBox", "0 0 " + this.width + ' ' + this.height)
            .classed("svg-content-responsive", true)
            .call(d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", () => {
                this.main.attr("transform", "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")")
            }))
            /*.attr("width", this.width + 120)
            .attr("height", this.height + 60);*/

        this.main = this.editorSvg
            .append("svg:g")
            .classed('main', true)
            //.attr("transform", "translate(" + 80 + "," + 20 + ")");


        this.nodesData = this.main
            .append("svg:g")
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
            .attr("r", 4.5)
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
            .style('font-size', '10px')

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
            console.log(d)
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
