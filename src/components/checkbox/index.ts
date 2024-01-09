import Checkbox from './Checkbox';
import Group from './Group';

type CheckComponentType = typeof Checkbox & {
    Group: typeof Group
}

const CheckComponent = Checkbox as CheckComponentType;
CheckComponent.Group = Group

export default CheckComponent;
