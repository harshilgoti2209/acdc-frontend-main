const intialState = {};

const reducer = (state = intialState, { type, ...rest }) => {
  switch (type) {
    case "set":
      return { ...state, ...rest };
    case "reset":
      return {};
    default:
      return state;
  }
};

export default reducer;
