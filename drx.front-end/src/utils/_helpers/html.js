import { parse } from 'node-html-parser';

export function getHtmlAttributes(html, selector, attrList = []) {

    const root = parse(html);
    const element = root.querySelector(selector);

    return attrList.reduce((obj, attr) => {

        obj[attr] = element.getAttribute(attr);
        return obj;

    }, {});


}