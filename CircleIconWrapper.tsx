import styled from "@emotion/styled"
import { ReactNode } from "react"

import { Typography } from "@/newComponents/Typography"
import { neutral08, white } from "@/newComponents/colors"

type CircleIconsWrapProps = {
  children: ReactNode
  hiddenItemsAmount: number
}

type ListCircleWrapProps = {
  children: ReactNode
  index: number
}
export const CircleIconsWrapper = ({ children, hiddenItemsAmount }: CircleIconsWrapProps) => (
  <CircleIconsWrapperStyled>
    {children}
    {hiddenItemsAmount && (
      <HiddenItemsNumber>
        <Typography type="b3" color={white}>
          +{hiddenItemsAmount}
        </Typography>
      </HiddenItemsNumber>
    )}
  </CircleIconsWrapperStyled>
)

export const ListCircleWrap = ({ children, index }: ListCircleWrapProps) => (
  <ListCircleWrapStyled index={index}>{children}</ListCircleWrapStyled>
)

const ListCircleWrapStyled = styled.li<{ index: number }>`
  width: 36px;
  height: 36px;
  left: ${({ index }) => `${index ? index * 30 : 0}px`};
  z-index: ${({ index }) => `${index ? 100 - index * 1 : 100}`};
`

const CircleIconsWrapperStyled = styled.ul`
  position: relative;
  list-style: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 5px;

  li {
    position: absolute;
  }
`

const HiddenItemsNumber = styled.li`
  border: 1px solid ${neutral08};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  position: absolute;
  background: ${neutral08};
  left: 150px;
  z-index: 94;
`
