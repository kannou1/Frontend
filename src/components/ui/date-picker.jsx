import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function DatePicker({ date, setDate, placeholder = "Pick a date", className, disabled }) {
  const [day, setDay] = React.useState(date ? date.getDate().toString() : "");
  const [month, setMonth] = React.useState(date ? (date.getMonth() + 1).toString() : "");
  const [year, setYear] = React.useState(date ? date.getFullYear().toString() : "");

  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => (currentYear - i).toString());

  const daysInMonth = React.useMemo(() => {
    if (!month || !year) return 31;
    const date = new Date(parseInt(year), parseInt(month), 0);
    return date.getDate();
  }, [month, year]);

  const days = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());

  React.useEffect(() => {
    if (day && month && year) {
      const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      setDate(selectedDate);
    } else {
      setDate(null);
    }
  }, [day, month, year, setDate]);

  React.useEffect(() => {
    if (date) {
      setDay(date.getDate().toString());
      setMonth((date.getMonth() + 1).toString());
      setYear(date.getFullYear().toString());
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
  }, [date]);

  return (
    <div className={cn("flex gap-2", className)}>
      <Select value={month} onValueChange={setMonth} disabled={disabled}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={day} onValueChange={setDay} disabled={disabled}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={year} onValueChange={setYear} disabled={disabled}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export { DatePicker };
