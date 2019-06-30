function mockRaf() {
  let requests = {}
  let nextId = 1
  let now = 0
  return {
    now: () => now,
    raf(callback) {
      const id = nextId++
      requests[id] = callback
      return id
    },
    cancel(id) {
      delete requests[id]
    },
    step({ count = 1, time = 1000 / 60 } = {}) {
      for (let i = 0; i < count; i++) {
        const current = requests
        requests = {}

        now += time
        for (const id in current) {
          const callback = current[id]
          callback(now)
        }
      }
    },
  }
}

module.exports = mockRaf
Object.defineProperty(mockRaf, 'default', { value: mockRaf })
