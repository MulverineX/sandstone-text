import { jsx_ } from "./component_handler";

function Test (props:{[key:string]:any}) {
   return {IDK:1,WTF:2}
}

function Test2 (props: { a: string, b?: number, children?: any[] }) {
   return props;
}

console.log(<Test/>);

console.log(<Test2 a="a" b={1}>
   test
</Test2>);