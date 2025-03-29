// src/components/TestRedux.js
import { useSelector, useDispatch } from 'react-redux';
import { setValue } from '../store/testSlice';

function TestRedux() {
  const value = useSelector(state => state.test.value);
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Redux Test</h2>
      <p>Current value: {value}</p>
      <button onClick={() => dispatch(setValue('Updated value!'))}>
        Update Value
      </button>
    </div>
  );
}

export default TestRedux;
