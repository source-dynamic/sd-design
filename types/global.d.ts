// 定义svg文件访问类型
declare module '*.svg' {
    const value: string;
    export default value;
}

// 定义window全局变量
interface Window {
    __OWL_VERSION__: string;
    __BUILD_DATE__: string;
}
