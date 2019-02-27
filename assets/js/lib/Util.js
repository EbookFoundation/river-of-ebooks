export default class Util {
  static combineReducers (...reducers) {
    return function (...reducerParams) {
      for (const reduce of reducers) {
        const changes = reduce(...reducerParams)
        if (changes && Object.keys(changes).length) return changes
      }
      return {}
    }
  }
}
