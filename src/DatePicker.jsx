import styled from "@emotion/styled";
import {
  Box,
  Chip,
  css,
  Grid,
  Paper,
  Popover,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useCallback } from "react";
import { useState } from "react";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { useEffect } from "react";
import moment from "moment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { useMemo } from "react";

export const ArrowStyle = styled(Paper)`
  height: 35px;
  width: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* position: absolute; */
  right: ${(props) => props.$isRight && "5px"};
  cursor: pointer;
  &:hover {
    background-color: #f4f4f4de;
  }
  & > button {
    border: none;
    background: white;
    width: 100%;
    border-radius: 50%;
  }
`;

export const StyledButton = styled("button")`
  box-shadow: 0px 3px 3px -2px rgba(0, 0, 0, 0.2),
    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);
  height: 35px;
  width: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: white;
  cursor: ${(props) => (props.disabled ? "no-drop" : "pointer")};
  &:hover {
    background-color: #f4f4f4de;
  }
`;

export const DateNumber = styled(Paper)`
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: center;
  margin: auto;
  font-size: 14px;
  align-items: center;
  pointer-events: ${({ $isDisable }) => ($isDisable ? "none" : "")};
  border: ${(props) =>
    props.$isToday ? `2px solid ${props?.activeColor}` : "none"};
  box-shadow: ${(props) => (!props.$date || props.$isDisable ? "none" : "")};
  border-radius: ${(props) => (!props.$date ? "unset" : " 50%")};
  pointer-events: ${(props) => (!props.$date ? "none" : "")};
  background-color: ${(props) =>
    props.$isActive
      ? props?.activeColor
      : props.$isBetween && props.$date
      ? props.betweenColor
      : props.$isDisable && props.$date
      ? props.disabledColor
      : props.$date
      ? "white"
      : "transparent"};

  color: ${(props) =>
    props.$isActive
      ? "white"
      : props.$isBetween
      ? "black"
      : props.$date && props.$isDisable
      ? "#837f7f"
      : "black"};

  ${(props) => {
    if (!props.$isActive && props.$date) {
      return css`
        &:hover {
          background-color: #f4f4f4de;
        }
      `;
    }
  }}
`;
export const HeaderBox = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
export const MonthBox = styled(Box)`
  font-weight: 600;
  flex-grow: 1;
  text-align: center;
`;

const DatePickerButton = styled("button")`
  width: 100%;
  min-width: 330px;
  height: 40px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: 1px solid #8c8989;
  cursor: pointer;
  & svg {
    position: absolute;
    left: 6px;
    font-size: 20px;
  }
`;

export const FilterLabelWrapper = styled(Grid)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  gap: 10px 10px;
`;
export const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const filterLabels1 = [
  {
    type: "month",
    value: 1,
    next: true,
    label: <> next 1 months</>,
  },
  {
    type: "week",
    value: 5,
    past: true,
    label: "past 1 weeks",
  },
  {
    type: "day",
    value: 3,
    next: true,
    label: "next 3 days",
  },
  {
    type: "month",
    value: 1,
    next: true,
    label: <> next 1 months</>,
  },
  {
    type: "week",
    value: 1,
    past: true,
    label: "past 1 weeks",
  },
  {
    type: "day",
    value: 3,
    next: true,
    label: "next 3 days",
  },
  {
    type: "month",
    value: 2,
    next: true,
    label: <> next 1 months</>,
  },
  {
    type: "week",
    value: 3,
    past: true,
    label: "past 1 weeks",
  },
  {
    type: "day",
    value: 9,
    next: true,
    label: "next 3 days",
  },
];

const LeftDatePicker = styled(Box)`
  flex-grow: 1;
  justify-content: space-between;
`;
const RightDatePicker = styled(Box)`
  flex-grow: 1;
  justify-content: space-between;
`;

const DatePicker = ({
  minDate = ``,
  maxDate = "",
  showOnlyOneDay = "",
  startDate,
  endDate,
  onApply = () => {},
  onCancel = () => {},
  onClear = () => {},
  onNextClick = () => {},
  onPreviousClick = () => {},
  filterLabels = filterLabels1,
  placeHolder = "Select Start Date And End Date",
  dateFormat = "MMMM D, YYYY",
  mainWrapperProps = {},
  nextButtonProps = {},
  previousButtonProps = {},
  monthYearFormat = "MMMM-YYYY",
  daysHeaderProps = {},
  dayProps = () => {
    return {};
  },
  dateProps = () => {
    return {};
  },
  clearButtonProps = {},
  applyButtonProps = {},
  cancelButtonProps = {},
  onDateClicks = (date) => {},
  onFilterClick = (filter) => {},
  selectedDateColor = "#0059B2",
  selectedDateRangeColor = "#cfe4f9",
  disabledColor = "#dcdcdc",
  filterLabelProps = () => {
    return {};
  },
  calenderIcon = <CalendarTodayIcon />,
  nextArrowIcon = <NavigateNextIcon />,
  previousArrowIcon = <NavigateBeforeIcon />,
  hamburgerProps = {},
  filterWrapperProps = {},
  customFilterText = "CUSTOM FILTERS",
  customFilterProps = {},
  filterOptionCloseIconProps = {},
  days=allDays
}) => {
  const [currentMonth, setCurrentMonth] = useState();
  const [nextMonth, setNextMonth] = useState();
  const [currentDates, setCurrentDates] = useState([]);
  const [nextDates, setNextDates] = useState([]);
  const [startDateEndDate, setStartDateEndDate] = useState([]);
  const [activeFilter, setActiveFilter] = useState();
  const [hoverDates, setHoverDates] = useState([]);
  const [isNexButtonDisable, setIsNexButtonDisable] = useState(false);
  const [isPreviousButtonDisable, setIsPreviousButtonDisable] = useState(false);
  const [isApply, setIsApply] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const getDates = (currMonth, nextMonth) => {
    const startOfMonth = moment(currMonth, "MMM-YYYY").startOf("month");
    const endOfMonth = moment(currMonth, "MMM-YYYY").endOf("month");
    let currDates = [];
    const extraDayAdd = startOfMonth.day();
    for (let i = startOfMonth.date(); i <= endOfMonth.date(); i++) {
      currDates = [...currDates, i];
    }
    for (let j = 0; j < extraDayAdd; j++) {
      currDates = ["", ...currDates];
    }
    setCurrentDates(currDates);

    const startOfNextMonth = moment(nextMonth, "MMM-YYYY").startOf("month");
    const endOfNextMonth = moment(nextMonth, "MMM-YYYY").endOf("month");

    let nextDates = [];
    const extraNextDayAdd = startOfNextMonth.day();

    for (let i = startOfNextMonth.date(); i <= endOfNextMonth.date(); i++) {
      nextDates.push(i);
    }
    for (let j = 0; j < extraNextDayAdd; j++) {
      nextDates.unshift("");
    }

    setNextDates(nextDates);
  };

  const disabledNextOrPreviousButton = useCallback(() => {
    const monthYear = [
      moment(currentMonth, monthYearFormat).format("MM"),
      moment(currentMonth, monthYearFormat).format("YYYY"),
    ];
    const nextMonthYear = [
      moment(nextMonth, monthYearFormat).format("MM"),
      moment(nextMonth, monthYearFormat).format("YYYY"),
    ];

    const minDateMonthYear = [
      moment(minDate, "YYYY-MM-DD").format("MM"),
      moment(minDate, "YYYY-MM-DD").format("YYYY"),
    ];
    const maxDateMonthYear = [
      moment(maxDate, "YYYY-MM-DD").format("MM"),
      moment(maxDate, "YYYY-MM-DD").format("YYYY"),
    ];

    if (
      (minDateMonthYear[0] === monthYear[0] &&
        minDateMonthYear[1] === monthYear[1]) ||
      (minDateMonthYear[0] === nextMonthYear[0] &&
        minDateMonthYear[1] === nextMonthYear[1])
    ) {
      setIsPreviousButtonDisable(true);
    } else {
      setIsPreviousButtonDisable(false);
    }

    if (
      (maxDateMonthYear[1] === monthYear[1] &&
        maxDateMonthYear[0] === monthYear[0]) ||
      (maxDateMonthYear[1] === nextMonthYear[1] &&
        maxDateMonthYear[0] === nextMonthYear[0])
    ) {
      setIsNexButtonDisable(true);
    } else {
      setIsNexButtonDisable(false);
    }
  }, [currentMonth, maxDate, minDate, monthYearFormat, nextMonth]);

  useEffect(() => {
    if (startDateEndDate.length === 2) {
      setHoverDates([]);
    }
  }, [startDateEndDate]);

  useEffect(() => {
    if (startDate && endDate && !moment(startDate).isAfter(endDate)) {
      setStartDateEndDate([startDate, endDate]);
      setIsApply(true);
    }

    return () => {
      setStartDateEndDate([]);
    };
  }, [startDate, endDate]);

  const handleSetDates = () => {
    let currMonth;
    let nextMonth;
    if (startDate && endDate) {
      currMonth = moment(startDate, "YYYY-MM-DD").format(monthYearFormat);
      nextMonth = moment(moment(currMonth).add(1, "months")._d).format(
        monthYearFormat
      );
    } else {
      currMonth = moment().format(monthYearFormat);
      nextMonth = moment(moment(currMonth).add(1, "months")._d).format(
        monthYearFormat
      );
    }
    setCurrentMonth(currMonth);
    setNextMonth(nextMonth);
  };

  useEffect(() => {
    handleSetDates();
  }, []);

  useEffect(() => {
    if (currentMonth) {
      getDates(currentMonth, nextMonth);
      minDate && disabledNextOrPreviousButton();
    }
  }, [
    nextMonth,
    currentMonth,
    minDate,
    showOnlyOneDay,
    disabledNextOrPreviousButton,
  ]);

  const handleNextMonth = () => {
    onNextClick();
    const currMonth = moment(
      moment(currentMonth, monthYearFormat).add(1, "months")._d
    ).format(monthYearFormat);
    const nexMonth = moment(
      moment(nextMonth, monthYearFormat).add(1, "months")._d
    ).format(monthYearFormat);
    setCurrentMonth(currMonth);
    setNextMonth(nexMonth);
  };
  const handlePreviousMonth = () => {
    onPreviousClick();
    setCurrentMonth(
      moment(
        moment(currentMonth, monthYearFormat).subtract(1, "months")._d
      ).format(monthYearFormat)
    );
    setNextMonth(
      moment(
        moment(nextMonth, monthYearFormat).subtract(1, "months")._d
      ).format(monthYearFormat)
    );
  };

  const onDateClick = (date, isCurrent) => {
    setActiveFilter();
    const monthYear = isCurrent
      ? [
          moment(currentMonth, monthYearFormat).format("MM"),
          moment(currentMonth, monthYearFormat).format("YYYY"),
        ]
      : [
          moment(nextMonth, monthYearFormat).format("MM"),
          moment(nextMonth, monthYearFormat).format("YYYY"),
        ];
    const selectDate = moment(`${monthYear[1]}-${monthYear[0]}-${date}`).format(
      "YYYY-MM-DD"
    );
    onDateClicks(selectDate);

    if (startDateEndDate[0] && startDateEndDate[1]) {
      setStartDateEndDate([selectDate]);
    } else {
      if (startDateEndDate.length) {
        if (!moment(selectDate).isAfter(startDateEndDate[0])) {
          setStartDateEndDate([selectDate]);
        } else {
          setStartDateEndDate([startDateEndDate[0], selectDate]);
        }
      } else {
        setStartDateEndDate([selectDate]);
      }
    }
  };

  const customFilter = (type, value, isPast) => {
    onFilterClick({ type, value, isPast });
    if (isPast) {
      const date = moment().subtract(value, type).format("YYYY-MM-DD");
      setStartDateEndDate([date, moment().format("YYYY-MM-DD")]);
    } else {
      const date = moment().add(value, type).format("YYYY-MM-DD");
      setStartDateEndDate([moment().format("YYYY-MM-DD"), date]);
    }
  };

  const handleOnMouseEnter = (selectDate) => {
    if (startDateEndDate.length === 1) {
      let getDaysBetweenDates = function (startDate, endDate) {
        let now = startDate.clone(),
          dates = [];

        while (now.isSameOrBefore(endDate)) {
          dates.push(now.format("YYYY-MM-DD"));
          now.add(1, "days");
        }
        return dates;
      };

      const startDate = moment(startDateEndDate[0]);
      const endDate = selectDate;

      const dateList = getDaysBetweenDates(startDate, endDate);
      setHoverDates(dateList);
    }
  };

  const handleClose = (setAnchorEl) => {
    setAnchorEl(null);
    onCancel();
    setTimeout(() => {
      handleSetDates();
      if (startDate && endDate && !moment(startDate).isAfter(endDate)) {
        setStartDateEndDate([startDate, endDate]);
        setIsApply(true);
      } else {
        setStartDateEndDate([]);
      }
    }, 500);
  };

  return (
    <DatePopover
      startDateEndDate={startDateEndDate}
      placeHolder={placeHolder}
      isApply={isApply}
      dateFormat={dateFormat}
      handleClose={(setAnchorEl) => handleClose(setAnchorEl)}
      calenderIcon={calenderIcon}
    >
      {({ setAnchorEl }) => (
        <Paper
          sx={{
            padding: filterLabels.length ? "10px 30px 10px 60px" : "10px 30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
          {...mainWrapperProps}
        >
          {!isOpen && filterLabels.length > 0 && (
            <MenuIcon
              style={{
                position: "absolute",
                left: "10px",
                top: "10px",
                height: "22px",
                background: "white",
                borderRadius: "50%",
                boxShadow:
                  "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
                width: "22px",
                padding: "5px",
                cursor: "pointer",
              }}
              {...hamburgerProps}
              onClick={() => setIsOpen(true)}
            />
          )}
          <MakeshiftDrawer
            filterOptionCloseIconProps={filterOptionCloseIconProps}
            component={
              <Box
                sx={{
                  width: "100%",
                }}
                {...filterWrapperProps}
              >
                <Box
                  sx={{
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                  {...customFilterProps}
                >
                  {customFilterText}
                </Box>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {filterLabels.length ? (
                    <FilterLabelWrapper
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                    >
                      {/* <StyledStack direction="row" spacing={1}> */}
                      {filterLabels.map((filter, index) => (
                        <Chip
                          label={filter.label}
                          color="primary"
                          size="small"
                          variant={
                            activeFilter === index ? "filled" : "outlined"
                          }
                          key={filter.type + index}
                          {...filterLabelProps(filter.label)}
                          onClick={() => {
                            setActiveFilter(index);
                            setHoverDates([]);
                            customFilter(
                              filter.type,
                              filter.value,
                              filter.past
                            );
                          }}
                        />
                      ))}
                      {/* </StyledStack> */}
                    </FilterLabelWrapper>
                  ) : (
                    ""
                  )}
                </Grid>
              </Box>
            }
            open={isOpen}
            setIsOpen={setIsOpen}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <LeftDatePicker>
              <HeaderBox>
                {/* <ArrowStyle elevation={3} {...previousButtonProps}> */}
                <StyledButton
                  {...previousButtonProps}
                  onClick={handlePreviousMonth}
                  disabled={isPreviousButtonDisable}
                >
                  {previousArrowIcon}
                </StyledButton>
                {/* </ArrowStyle> */}
                <MonthBox>{currentMonth}</MonthBox>
              </HeaderBox>
              <DateTable
                showOnlyOneDay={showOnlyOneDay}
                dates={currentDates}
                month={currentMonth}
                onDateClick={onDateClick}
                startDateEndDate={startDateEndDate}
                isCurrent={true}
                hoverDates={hoverDates}
                setHoverDates={setHoverDates}
                minDate={minDate}
                maxDate={maxDate}
                handleOnMouseEnter={handleOnMouseEnter}
                monthYearFormat={monthYearFormat}
                daysHeaderProps={daysHeaderProps}
                dayProps={dayProps}
                dateProps={dateProps}
                selectedDateColor={selectedDateColor}
                selectedDateRangeColor={selectedDateRangeColor}
                disabledColor={disabledColor}
                days={days}
              />
            </LeftDatePicker>
            <RightDatePicker>
              <HeaderBox>
                <MonthBox>{nextMonth}</MonthBox>

                <StyledButton
                  {...nextButtonProps}
                  onClick={handleNextMonth}
                  disabled={isNexButtonDisable}
                >
                  {nextArrowIcon}
                </StyledButton>
              </HeaderBox>
              <DateTable
                showOnlyOneDay={showOnlyOneDay}
                dates={nextDates}
                month={nextMonth}
                onDateClick={onDateClick}
                startDateEndDate={startDateEndDate}
                isCurrent={false}
                hoverDates={hoverDates}
                setHoverDates={setHoverDates}
                minDate={minDate}
                maxDate={maxDate}
                handleOnMouseEnter={handleOnMouseEnter}
                monthYearFormat={monthYearFormat}
                daysHeaderProps={daysHeaderProps}
                dayProps={dayProps}
                dateProps={dateProps}
                selectedDateColor={selectedDateColor}
                selectedDateRangeColor={selectedDateRangeColor}
                disabledColor={disabledColor}
                days={days}
              />
            </RightDatePicker>
          </Box>
          <Box
            sx={{
              width: "100%",
              justifyContent: "end",
              display: "flex",
              gap: "10px",
            }}
          >
            <Chip
              label="Clear"
              color="info"
              variant={"outlined"}
              {...clearButtonProps}
              onClick={() => {
                setActiveFilter(null);
                setStartDateEndDate([]);
                onClear();
              }}
            />
            <Chip
              label="Cancel"
              color="error"
              variant={"outlined"}
              {...cancelButtonProps}
              onClick={() => handleClose(setAnchorEl)}
            />
            <Chip
              label="Apply"
              color="primary"
              variant={"filled"}
              {...applyButtonProps}
              onClick={() => {
                if (startDateEndDate.length === 2) {
                  onApply([
                    moment(startDateEndDate[0], "YYYY-MM-DD").format(
                      dateFormat
                    ),
                    moment(startDateEndDate[1], "YYYY-MM-DD").format(
                      dateFormat
                    ),
                  ]);
                  setIsApply(true);
                }
                setAnchorEl(null);
              }}
            />
          </Box>
        </Paper>
      )}
    </DatePopover>
  );
};

export default DatePicker;

const DatePopover = ({
  children,
  startDateEndDate,
  placeHolder,
  isApply,
  dateFormat,
  handleClose,
  calenderIcon,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [start, end] = startDateEndDate;
  const showValue =
    startDateEndDate.length === 2
      ? moment(start, "YYYY-MM-DD").format(dateFormat) +
        " - " +
        moment(end, "YYYY-MM-DD").format(dateFormat)
      : null;
  return (
    <>
      <DatePickerButton aria-describedby={id} onClick={handleClick}>
        <small>{isApply && showValue ? showValue : placeHolder}</small>
        {calenderIcon}
      </DatePickerButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => handleClose(setAnchorEl)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {children({ setAnchorEl })}
      </Popover>
    </>
  );
};

const TableData = styled(TableCell)`
  text-align: center;
  cursor: ${({ $isDisable }) => ($isDisable ? "no-drop" : "pointer")};
`;

export const DateTable = ({
  showOnlyOneDay,
  dates,
  month,
  onDateClick,
  startDateEndDate,
  isCurrent,
  hoverDates,
  setHoverDates,
  minDate,
  maxDate,
  handleOnMouseEnter,
  monthYearFormat,
  daysHeaderProps,
  dayProps,
  dateProps,
  selectedDateColor,
  selectedDateRangeColor,
  disabledColor,
  days
}) => {
  let rows = useMemo(
    () =>
      dates.reduce(
        (acc, curr) => {
          if (acc[acc.length - 1].length < 7) {
            acc[acc.length - 1] = [...acc[acc.length - 1], curr];
          } else {
            acc.push([curr]);
          }
          return acc;
        },
        [[]]
      ),
    [dates]
  );

  if (rows.length < 6) {
    for (let i = 0; i < 6 - rows.length; i++) {
      rows.push(["", "", "", "", "", "", ""]);
    }
  }
  return (
    <TableContainer>
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow {...daysHeaderProps}>
            {days.map((day, index) => (
              <TableCell
                align="center"
                key={`${day}${index}`}
                sx={{ padding: "8px 0px" }}
                {...dayProps(day)}
              >
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {row.map((date, ind) => {
                const monthYear = [
                  moment(month, monthYearFormat).format("MM"),
                  moment(month, monthYearFormat).format("YYYY"),
                ];
                // const monthYear = month?.split("-");

                const selectDate =
                  date &&
                  moment(`${monthYear[1]}-${monthYear[0]}-${date}`).format(
                    "YYYY-MM-DD"
                  );
                const currentDay = moment(selectDate, "YYYY-MM-DD").format(
                  "dddd"
                );
                const disabledDate = () => {
                  if (!showOnlyOneDay) {
                    return false;
                  } else {
                    if (minDate && maxDate) {
                      return !(
                        moment(selectDate).isSameOrBefore(maxDate) &&
                        moment(selectDate).isSameOrAfter(minDate) &&
                        currentDay === showOnlyOneDay
                      );
                    } else {
                      if (minDate) {
                        return !(
                          moment(selectDate).isSameOrAfter(minDate) &&
                          currentDay === showOnlyOneDay
                        );
                      } else if (maxDate) {
                        return !(
                          moment(selectDate).isSameOrBefore(maxDate) &&
                          currentDay === showOnlyOneDay
                        );
                      } else {
                        return currentDay !== showOnlyOneDay;
                      }
                    }
                  }
                };
                const disableDate = disabledDate();
                return (
                  <TableData
                    align="center"
                    key={`${date}${ind}`}
                    $isDisable={disableDate}
                    sx={{ padding: "5px", border: "none" }}
                  >
                    <DateNumber
                      elevation={3}
                      $isActive={
                        !!date && startDateEndDate.includes(selectDate)
                      }
                      $isBetween={
                        disableDate
                          ? false
                          : startDateEndDate.length === 2
                          ? moment(selectDate).isBetween(
                              startDateEndDate[0],
                              startDateEndDate[1]
                            )
                          : hoverDates.includes(selectDate)
                      }
                      $date={date}
                      $isToday={moment().format("YYYY-MM-DD") === selectDate}
                      $isDisable={disableDate}
                      activeColor={selectedDateColor}
                      betweenColor={selectedDateRangeColor}
                      disabledColor={disabledColor}
                      {...dateProps({
                        date: selectDate,
                        isToday: moment().format("YYYY-MM-DD") === selectDate,
                      })}
                      onClick={() => onDateClick(date, isCurrent)}
                      onMouseEnter={() => {
                        handleOnMouseEnter(selectDate);
                      }}
                      onMouseLeave={() => {
                        startDateEndDate.length !== 2 && setHoverDates([]);
                      }}
                    >
                      {date}
                    </DateNumber>
                  </TableData>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
const StyledPaper = styled(Paper)({
  maxWidth: "150px",
  width: "100%",
  position: "absolute",
  height: "calc(100% - 20px)",
  left: "0px",
  top: "0px",
  zIndex: 9999999,
  overflow: "auto",
  padding: "10px 0",
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-end",
  flexDirection: "column",
});

const StyledIconButton = styled(CloseIcon)({
  height: "22px",
  background: "white",
  borderRadius: "50%",
  boxShadow:
    "0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)",
  width: "22px",
  padding: "5px",
  cursor: "pointer",
});
export function MakeshiftDrawer({
  open,
  setIsOpen,
  component,
  filterOptionCloseIconProps,
}) {
  return open ? (
    <StyledPaper elevation={4}>
      <StyledIconButton
        {...filterOptionCloseIconProps}
        onClick={() => setIsOpen(false)}
      />
      {component}
    </StyledPaper>
  ) : (
    ""
  );
}
