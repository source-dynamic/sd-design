import Input from './Input';
import Password from './Password';

type InputComponent = typeof Input & {
    Password: typeof Password;
}

const InputComponent = Input as InputComponent;

InputComponent.Password = Password;

export default InputComponent;
