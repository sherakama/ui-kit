import {h} from '@stencil/core';

import docs from '../../../../docs/atomic-docs.json';
import AtomicFacetDoc from './atomic-facet.mdx';

const searchboxDoc = docs.components.find((cmp) => cmp.tag === 'atomic-facet');
import {debounce} from 'lodash';
const args: Record<string, Object> = {};

searchboxDoc?.props.forEach((prop) => {
  args[prop.name] = {
    description: prop.docs,
    asd: '123',
    required: prop.required,
    table: {defaultValue: {summary: (prop as any).default}},
    control: {
      type: prop.values[0].type === 'string' ? 'text' : prop.values[0].type,
    },
  };
});

const argsToString = (currentArgs: any) => {
  const el = document.createElement(searchboxDoc!.tag);
  Object.keys(currentArgs).forEach((a) => {
    el.setAttribute(a, currentArgs[a]);
  });
  return el.outerHTML;
};

export default {
  title: 'Atomic/Facet',
  argTypes: args,
  parameters: {
    docs: {
      page: AtomicFacetDoc,
      /*inlineStories: false,
      state: 'open',
      iframeHeight: 500,
      source: {
        language: 'html',
      },
      transformSource: (
        __: string,
        parameters: {args: Record<string, any>}
      ) => {
        return argsToString(parameters.args);
      },*/
    },
  },
};

const defaultArgs = {
  field: 'objecttype',
};

let currentArgs = {};

export const Default = (args: any) => {
  currentArgs = args;
  return <atomic-search-interface></atomic-search-interface>;
};

Default.decorators = [
  (Story: any, params: any) => {
    return (
      <div>
        YO
        <Story />
        <code>{argsToString(params.args)}</code>
      </div>
    );
  },
];

const debouncedInit = debounce(
  async () => {
    const searchInterface = document.querySelector('atomic-search-interface');
    const parent = searchInterface?.parentElement;
    if (searchInterface) {
      searchInterface.remove();
      const clone = searchInterface.cloneNode() as HTMLElement;
      console.log(currentArgs);
      const fa = argsToString(currentArgs);
      clone.innerHTML = fa;
      parent?.append(clone);
      await (clone as any)?.initialize({
        accessToken: 'xx564559b1-0045-48e1-953c-3addd1ee4457',
        organizationId: 'searchuisamples',
      });
      (clone as any).executeFirstSearch();
    }
  },
  2000,
  {trailing: true}
);

Default.loaders = [() => debouncedInit()];
