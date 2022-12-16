// @ts-ignore
import {createElement} from 'lwc';
import QuanticResultDate from '../quanticFieldCondition';

const exampleField = 'exampledatefield';
const exampleFieldValue = 1670118414000;
const exampleResult = {
  raw: {
    [exampleField]: exampleFieldValue,
  },
};

const errorSelector = '.error-message';
const childClass = 'child-element';

const defaultOptions = {
  result: exampleResult,
  isDefined: exampleField,
};

function createTestComponent(options = defaultOptions) {
  const element = createElement('c-quantic-field-condition', {
    is: QuanticResultDate,
  });

  for (const [key, value] of Object.entries(options)) {
    element[key] = value;
  }

  document.body.appendChild(element);

  return element;
}

function createTestChildElement(element) {
  const childElement = document.createElement('div');
  childElement.classList.add(childClass);
  element.appendChild(childElement);
}

// Helper function to wait until the microtask queue is empty.
function flushPromises() {
  // eslint-disable-next-line @lwc/lwc/no-async-operation
  return new Promise((resolve) => setTimeout(resolve, 0));
}

describe('c-quantic-field-condition', () => {
  function cleanup() {
    // The jsdom instance is shared across test cases in a single file so reset the DOM
    while (document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
    jest.clearAllMocks();
  }

  beforeEach(() => {
    console.error = jest.fn();
    // @ts-ignore
    global.Bueno = {
      isString: jest
        .fn()
        .mockImplementation(
          (value) => Object.prototype.toString.call(value) === '[object String]'
        ),
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe('when no result is given', () => {
    it('should show an error', async () => {
      // @ts-ignore
      const element = createTestComponent({isDefined: exampleField});
      await flushPromises();
      const errorMessage = element.shadowRoot.querySelector(errorSelector);

      expect(errorMessage).not.toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'The c-quantic-field-condition requires a result and a field to be specified.'
      );
    });
  });

  describe('when no field is given', () => {
    it('should show an error', async () => {
      // @ts-ignore
      const element = createTestComponent({result: exampleResult});
      await flushPromises();

      const errorMessage = element.shadowRoot.querySelector(errorSelector);

      expect(errorMessage).not.toBeNull();
      expect(console.error).toHaveBeenCalledWith(
        'The c-quantic-field-condition requires a result and a field to be specified.'
      );
    });
  });

  describe('when required props are given', () => {
    describe('when the result has the given field', () => {
      it('should display the child contents', async () => {
        const element = createTestComponent();
        await flushPromises();

        createTestChildElement(element);

        const childElement = element.shadowRoot.querySelector(`.${childClass}`);

        expect(childElement).not.toBeNull();
      });
    });

    describe('when the result does not have the given field', () => {
      const testOptions = {
        ...defaultOptions,
        result: {
          raw: {},
        },
      };

      it('should not display the child contents', async () => {
        // @ts-ignore
        const element = createTestComponent(testOptions);
        await flushPromises();

        const slot = element.shadowRoot.querySelector('slot');

        expect(slot).toBeNull();
      });
    });
  });
});
