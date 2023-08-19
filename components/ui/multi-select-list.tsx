/* eslint-disable react/display-name */

import * as React from "react"
import { GroupBase, OptionProps } from "react-select"
import { VariableSizeList as List, ListChildComponentProps } from "react-window"

export function isFocused({ props: { isFocused } }) {
  return isFocused === true
}

export function getCurrentIndex(children) {
  return Math.max(children.findIndex(isFocused), 0)
}

export function createGetHeight({
  noOptionsMsgStyles,
  optionStyles,
  loadingMsgStyles,
}) {
  return function getHeight(child) {
    const {
      props: {
        type,
        children,
        inputValue,
        selectProps: { noOptionsMessage, loadingMessage },
      },
    } = child

    if (type === "option") {
      const { height = 35 } = optionStyles
      return height
    } else if (
      typeof noOptionsMessage === "function" &&
      children === noOptionsMessage({ inputValue })
    ) {
      const { height = 35 } = noOptionsMsgStyles
      return height
    } else if (
      typeof loadingMessage === "function" &&
      children === loadingMessage({ inputValue })
    ) {
      const { height = 35 } = loadingMsgStyles
      return height
    } else {
      return 35
    }
  }
}

interface Style extends React.CSSProperties {
  top: number
}

interface ListChildProps extends ListChildComponentProps {
  style: Style
  data: Object[]
  index: number
}

interface OptionTypeBase {
  [key: string]: any
}

function MenuList(props: any) {
  const children = React.useMemo(() => {
    const children = React.Children.toArray(props.children)

    const head = children[0] || {}

    if (
      React.isValidElement<
        OptionProps<OptionTypeBase, boolean, GroupBase<OptionTypeBase>>
      >(head)
    ) {
      return children
    } else {
      return []
    }
  }, [props.children])

  const { getStyles } = props
  const loadingMsgStyles = getStyles("loadingMessage", props)
  const noOptionsMsgStyles = getStyles("noOptionsMessage", props)
  const optionStyles = getStyles("option", props)
  const getHeight = createGetHeight({
    noOptionsMsgStyles,
    optionStyles,
    loadingMsgStyles,
  })

  const heights = React.useMemo(
    () => children.map(getHeight),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [children]
  )
  const currentIndex = React.useMemo(
    () => getCurrentIndex(children),
    [children]
  )

  const itemCount = children.length

  const [measuredHeights, setMeasuredHeights] = React.useState({})

  // calc menu height
  const {
    maxHeight,
    paddingBottom = 0,
    paddingTop = 0,
    ...menuListStyle
  } = getStyles("menuList", props)
  const totalHeight = React.useMemo(() => {
    return heights.reduce((sum, height, idx) => {
      if (measuredHeights[idx]) {
        return sum + measuredHeights[idx]
      } else {
        return sum + height
      }
    }, 0)
  }, [heights, measuredHeights])
  const totalMenuHeight = totalHeight + paddingBottom + paddingTop
  const menuHeight = Math.min(maxHeight, totalMenuHeight)
  const estimatedItemSize = Math.floor(totalHeight / itemCount)

  const { innerRef, selectProps } = props

  const { classNamePrefix } = selectProps || {}
  const list = React.useRef<List>(null)

  React.useEffect(() => {
    setMeasuredHeights({})
  }, [props.children])

  // method to pass to inner item to set this items outer height
  const setMeasuredHeight = ({ index, measuredHeight }) => {
    if (
      measuredHeights[index] !== undefined &&
      measuredHeights[index] === measuredHeight
    ) {
      return
    }

    setMeasuredHeights((measuredHeights) => ({
      ...measuredHeights,
      [index]: measuredHeight,
    }))

    // this forces the list to rerender items after the item positions resizing
    if (list.current) {
      list.current.resetAfterIndex(index)
    }
  }

  React.useEffect(() => {
    /**
     * enables scrolling on key down arrow
     */
    if (currentIndex >= 0 && list.current !== null) {
      list.current.scrollToItem(currentIndex)
    }
  }, [currentIndex, children, list])

  return (
    <List
      className={
        classNamePrefix
          ? `${classNamePrefix}__menu-list ${classNamePrefix}__menu-list--is-multi`
          : ""
      }
      style={menuListStyle}
      ref={list}
      // outerRef={innerRef}
      estimatedItemSize={estimatedItemSize}
      innerElementType={React.forwardRef<
        HTMLDivElement,
        React.HTMLAttributes<HTMLDivElement>
      >(({ style, ...rest }, ref) => (
        <div
          ref={ref}
          style={{
            ...style,
            height: `${style?.height + paddingBottom + paddingTop}px`,
          }}
          {...rest}
        />
      ))}
      height={menuHeight}
      width="100%"
      itemCount={itemCount}
      itemData={children}
      itemSize={(index: number) => measuredHeights[index] || heights[index]}
    >
      {({ data, index, style }: ListChildProps) => {
        return (
          <div
            className="p-1"
            style={{
              ...style,
              top: `${parseFloat(style.top.toString()) + paddingTop + 3}px`,
            }}
          >
            <MenuItem
              data={data[index]}
              index={index}
              setMeasuredHeight={setMeasuredHeight}
            />
          </div>
        )
      }}
    </List>
  )
}

function MenuItem({ data, index, setMeasuredHeight }) {
  const ref = React.useRef<HTMLDivElement>(null)

  // using useLayoutEffect prevents bounciness of options of re-renders
  React.useLayoutEffect(() => {
    if (ref.current) {
      const measuredHeight = ref.current.getBoundingClientRect().height

      setMeasuredHeight({ index, measuredHeight })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current])

  return (
    <div key={`option-${index}`} ref={ref}>
      {data}
    </div>
  )
}
export default MenuList
