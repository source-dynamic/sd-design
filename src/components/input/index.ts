import Input from './Input';
import Password from './Password';
import TextArea from './TextArea';

type InputComponentType = typeof Input & {
    Password: typeof Password;
    TextArea: typeof TextArea;
}

const InputComponent = Input as InputComponentType;

InputComponent.Password = Password;
InputComponent.TextArea = TextArea;

export default InputComponent;
