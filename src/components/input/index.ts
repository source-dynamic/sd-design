import Input from './Input';
import Password from './Password';
import TextArea from './TextArea';

type InputComponent = typeof Input & {
    Password: typeof Password;
    TextArea: typeof TextArea;
}

const InputComponent = Input as InputComponent;

InputComponent.Password = Password;
InputComponent.TextArea = TextArea;

export default InputComponent;
