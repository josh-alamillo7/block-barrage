const Queue = function() {
    this.storage = {};
    this.addIndex = 0;
    this.removeIndex = 0;
    this.size = 0;
  }

  Queue.prototype.enqueue = function(value) {
    this.storage[this.addIndex] = value;
    this.addIndex++
    this.size++
  }

  Queue.prototype.dequeue = function() {
    if (this.removeIndex === this.addIndex && this.size > 0) {
      const removedValue = this.storage[this.removeIndex];
      this.size--;
      delete this.storage[this.removeIndex];
      return removedValue
    } else if (this.size > 0) {
      const removedValue = this.storage[this.removeIndex];
      this.size--;
      delete this.storage[this.removeIndex];
      this.removeIndex++
      return removedValue
    }
  }

module.exports.Queue = Queue