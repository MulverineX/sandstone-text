export function jsx_(comp: Function, props: null | { [key: string]: any }, ...children: any[]) {
   return comp({...props, children});
}