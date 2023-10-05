"use client"

import React, { Dispatch, createContext, useReducer } from "react"

type StateType = {
  questionnaireId: string | null
  resumeId: string | null
}

type ActionType = {
  type: string
  payload: {
    questionnaireId?: StateType["questionnaireId"]
    resumeId?: StateType["resumeId"]
  }
}

const initialState: StateType = {
  questionnaireId: null,
  resumeId: null,
}

const reducer = (state: StateType, action: ActionType) => {
  switch (action.type) {
    case "UPDATE":
      return { ...state, ...action.payload }
    default:
      throw Error("Unknown action for switcher context: " + action.type)
  }
}

export const SwitcherContext = createContext<{
  state: StateType
  dispatch: Dispatch<ActionType>
}>({ state: initialState, dispatch: () => null })

export const SwitcherContextProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <SwitcherContext.Provider value={{ state, dispatch }}>
      {children}
    </SwitcherContext.Provider>
  )
}
