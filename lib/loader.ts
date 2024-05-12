import { basePath } from "../next.config";
import path from "path";

interface Props{
  src:string;
  width:string;
}

export default function myImageLoader({src,width}:Props) {
  if( basePath && path.isAbsolute(src) /* && !src.startsWith('http') */){
    return `${basePath}${src}?width=${width}`;
  }
  return `${src}?width=${width}`;
}