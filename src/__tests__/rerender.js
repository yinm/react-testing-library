import * as React from 'react'
import {render, configure} from '../'

test('rerender will re-render the element', () => {
  const Greeting = props => <div>{props.message}</div>
  const {container, rerender} = render(<Greeting message="hi" />)
  expect(container.firstChild).toHaveTextContent('hi')
  rerender(<Greeting message="hey" />)
  expect(container.firstChild).toHaveTextContent('hey')
})

test('hydrate will not update props until next render', () => {
  const initialInputElement = document.createElement('input')
  const container = document.createElement('div')
  container.appendChild(initialInputElement)
  document.body.appendChild(container)

  const firstValue = 'hello'
  initialInputElement.value = firstValue

  const {rerender} = render(<input value="" onChange={() => null} />, {
    container,
    hydrate: true,
  })

  expect(initialInputElement).toHaveValue(firstValue)

  const secondValue = 'goodbye'
  rerender(<input value={secondValue} onChange={() => null} />)
  expect(initialInputElement).toHaveValue(secondValue)
})

test('re-renders options.wrapper around node when reactStrictMode is true', () => {
  configure({reactStrictMode: true})

  const WrapperComponent = ({children}) => (
    <div data-testid="wrapper">{children}</div>
  )
  const Greeting = props => <div>{props.message}</div>
  const {container, rerender} = render(<Greeting message="hi" />, {
    wrapper: WrapperComponent,
  })

  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      data-testid=wrapper
    >
      <div>
        hi
      </div>
    </div>
  `)

  rerender(<Greeting message="hey" />)
  expect(container.firstChild).toMatchInlineSnapshot(`
    <div
      data-testid=wrapper
    >
      <div>
        hey
      </div>
    </div>
  `)

  // reset for other tests
  configure({reactStrictMode: false})
})

test('re-renders twice when reactStrictMode is true', () => {
  configure({reactStrictMode: true})

  const spy = jest.fn()
  function Component() {
    spy()
    return null
  }

  const {rerender} = render(<Component />)
  expect(spy).toHaveBeenCalledTimes(2)

  spy.mockReset()
  rerender(<Component />)
  expect(spy).toHaveBeenCalledTimes(2)

  // reset for other tests
  configure({reactStrictMode: false})
})
