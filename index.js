function mockRaf() {
  let requests = new Map()
  let nextId = 1
  let now = 0
  return {
    now: () => now,
    raf(callback) {
      const id = nextId++
      requests.set(id, callback)
      return id
    },
    cancel(id) {
      requests.delete(id)
    },
    step({ count = 1, time = 1000 / 60 } = {}) {
      for (let i = 0; i < count; i++) {
        const current = Array.from(requests.values())
        requests.clear()

        now += time
        current.forEach(callback => callback(now))
      }
    },
    flush() {
      while (requests.size) {
        this.step()
      }
    },
  }
}

module.exports = mockRaf
Object.defineProperty(mockRaf, 'default', { value: mockRaf })
