class NodeData {
    constructor(uniq_id, pos_x, pos_y, width, height, nexts, type, name, description, tool, true_next, false_next) {
      this.uniq_id = uniq_id;
      this.pos_x = pos_x;
      this.pos_y = pos_y;
      this.width = width;
      this.height = height;
      this.nexts = nexts;
      this.type = type;
      this.name = name;
      this.description = description;
      this.tool = tool;
      this.true_next = true_next;
      this.false_next = false_next;
    }
  
    static fromReactFlowNode(node) {
      return new NodeData(
        node.id,
        node.position.x,
        node.position.y,
        node.width || 200, // Default width
        node.height || 200, // Default height
        [], // We will handle edges separately
        'STEP', // Default type
        node.data.label,
        node.data.description || '',
        '',
        null,
        null
      );
    }
  
    static fromDict(data) {
      return new NodeData(
        data.uniq_id,
        data.pos_x,
        data.pos_y,
        data.width,
        data.height,
        data.nexts,
        data.type,
        data.name,
        data.description,
        data.tool,
        data.true_next,
        data.false_next
      );
    }
  
    toReactFlowNode() {
      return {
        id: this.uniq_id,
        type: 'textUpdater',
        data: { label: this.name, description: this.description },
        position: { x: this.pos_x, y: this.pos_y },
        width: this.width,
        height: this.height,
      };
    }
  
    toDict() {
      return {
        uniq_id: this.uniq_id,
        pos_x: this.pos_x,
        pos_y: this.pos_y,
        width: this.width,
        height: this.height,
        nexts: this.nexts,
        type: this.type,
        name: this.name,
        description: this.description,
        tool: this.tool,
        true_next: this.true_next,
        false_next: this.false_next,
      };
    }
  }
  
  export default NodeData;
  