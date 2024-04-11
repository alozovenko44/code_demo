import styled from "@emotion/styled"
import { useState } from "react"
import {
  Bar,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import { CategoricalChartState } from "recharts/types/chart/generateCategoricalChart"
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent"

import { compactNumberFormatter, numberFormatter } from "@/components/helpers/utils"
import {
  Color,
  electricBlue,
  greenTransparentPercentage,
  labelSecondaryColor,
  neutral08,
} from "@/components/ui/colors"
import { t } from "@/language"
import { Typography } from "@/newComponents/Typography"
import { greenPercentage, lightBlue2 } from "@/newComponents/colors"

import { NoDataMessage } from "./NoDataMessage"

type BarChartTooltipProps = CustomLegendProps & TooltipProps<ValueType, NameType>

type CustomLegendProps = {
  legendNames?: string[]
  colors?: Color[]
}

const BarChartComponent = ({
     graphData,
     colors,
     selectedPeriod,
     loading,
     noDataMessage,
     noDataMessageSize,
     legendNames,
     chartHeight,
   }: Pick<
  Props,
  | "graphData"
  | "colors"
  | "selectedPeriod"
  | "loading"
  | "noDataMessage"
  | "noDataMessageSize"
  | "legendNames"
  | "chartHeight"
>) => {
  const canLoadingData = getCanLoadingData(graphData)
  const [focusBar, setFocusBar] = useState<number | null>(null)

  const onMouseMove = (state: CategoricalChartState) => {
    if (state && state.isTooltipActive && state.activeTooltipIndex) {
      setFocusBar(state.activeTooltipIndex)
    } else {
      setFocusBar(null)
    }
  }

  return (
    <ChartWrapper>
      {!canLoadingData && <NoDataMessage noDataMessage={noDataMessage} size={noDataMessageSize} />}
      <ResponsiveContainer
        height={chartHeight ? chartHeight : 300}
        width="100%"
        data-testid="graph-wrap"
      >
        <StyledBarChart
          data={graphData}
          margin={{ top: 24, right: 24, left: 24, bottom: 24 }}
          onMouseMove={(state) => onMouseMove(state)}
        >
          <CartesianGrid strokeDasharray="4 4" vertical={false} />
          <XAxis
            axisLine={false}
            dataKey={loading ? "patch" : "date"}
            interval={getInterval(selectedPeriod)}
            tick={{
              fill: `${labelSecondaryColor}`,
              fontWeight: 300,
              fontFamily: "Manrope",
              fontSize: "14px",
            }}
          />
          <YAxis
            axisLine={false}
            padding={{ top: 10, bottom: 24 }}
            tick={{
              fill: `${labelSecondaryColor}`,
              fontWeight: 300,
              fontFamily: "Manrope",
              fontSize: "14px",
            }}
            domain={
              canLoadingData
                ? [0, (dataMax: number) => (dataMax ? Math.ceil(dataMax * 1.2) : 7)]
                : [0, 7]
            }
            scale="linear"
            tickFormatter={(value) => compactNumberFormatter(value)}
          />
          {canLoadingData && (
            <>
              <Tooltip
                content={<CustomTooltip colors={colors} legendNames={legendNames} />}
                cursor={false}
              />
              <>
                {colors.map((color, index) => {
                  return (
                    <Bar
                      dataKey={`volume[${index}]`}
                      fill="rgba(43, 92, 231, 0.2)"
                      barSize={30}
                      key={color}
                      stackId="a"
                    >
                      {graphData.map((item, i) => {
                        return (
                          <Cell key={`s-${i}`} fill={color} opacity={focusBar === i ? 1 : 0.5} />
                        )
                      })}
                    </Bar>
                  )
                })}
              </>
            </>
          )}
        </StyledBarChart>
      </ResponsiveContainer>
      {legendNames && <CustomLegend legendNames={legendNames} colors={colors} />}
    </ChartWrapper>
  )
}

const CustomTooltip = ({ active, payload, label, colors, legendNames }: BarChartTooltipProps) => {
  const showTooltip =
    payload?.length && +payload[0].payload.volume.some((item: number[] | string[]) => +item !== 0)

  if (!active || !showTooltip) {
    return null
  }

  const itemsWithLegendNames = () =>
    legendNames?.map((item: string, index: number) => {
      if (payload?.length && payload[0].payload.percentage) {
        return (
          Number(payload[0].payload.percentage[index]) !== 0 && (
            <ListItem key={index}>
              <ListItemTitle>
                {colors && <ListItemIndicator bgColor={colors[index]} />}
                <Typography type="b3" textTransform="capitalize">
                  {item}
                </Typography>
              </ListItemTitle>
              <ListItemNumberValues>
                <ListItemPercentage
                  color={greenPercentage}
                  type="b4"
                >{`${payload[0].payload.percentage[index]}%`}</ListItemPercentage>
                <Typography
                  type="b4"
                  color={electricBlue}
                >{`${payload[0].payload.currencies[index]} ${payload[0].payload.volume[index]}`}</Typography>
              </ListItemNumberValues>
            </ListItem>
          )
        )
      }
      return (
        <ListItem key={index}>
          <ListItemTitle>
            {colors && <ListItemIndicator bgColor={colors[index]} />}
            <Typography type="b4" color={neutral08}>
              {legendNames[index]}
            </Typography>
          </ListItemTitle>
          <Typography type="b3" color={electricBlue}>
            {numberFormatter(Number(payload[0].payload.volume[index]))}
          </Typography>
        </ListItem>
      )
    })

  const itemsWithoutLegendNames = () =>
    payload[0].payload.volume.map((item: number, index: number) => (
      <ListItemNoPercentage key={index}>
        <Typography type="b3" color={electricBlue}>
          {numberFormatter(Number(item))}
        </Typography>
      </ListItemNoPercentage>
    ))

  return (
    <CustomerTooltip>
      <CustomerTooltipTitle type="t2">{t("analytics.overall")}</CustomerTooltipTitle>
      <DateStamp type="t5" color={lightBlue2}>
        {label}
      </DateStamp>
      <ListWrapper>
        {legendNames?.length && colors ? itemsWithLegendNames() : itemsWithoutLegendNames()}
      </ListWrapper>
    </CustomerTooltip>
  )
}

const ListItemNoPercentage = styled.div`
  display: flex;
  margin-bottom: 8px;
  gap: 10px;
`

const ListItemNumberValues = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 5px 0 10px 0;
`

const ListItemPercentage = styled(Typography)`
  background: ${greenTransparentPercentage};
  padding: 0 2px;
  border-radius: 4px;
`

const DateStamp = styled(Typography)`
  display: flex;
  font-weight: 400;
  margin-bottom: 10px;
`

const CustomerTooltipTitle = styled(Typography)`
  display: flex;
`
const ListWrapper = styled.ul`
  list-style: none;
  width: 100%;
  padding: 0 10px;
`
const ListItem = styled.li`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const ListItemTitle = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
`
const ListItemIndicator = styled.span<{ bgColor: string }>`
  background-color: ${({ bgColor }) => bgColor};
  width: 12px;
  height: 12px;
`