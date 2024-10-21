import React from "react";
import Typography from "@mui/material/Typography";
import TodoContainer from "../components/TodoContainer";

function MyDay() {
  return (
    <div>
      <Typography variant="h2" color="primary">
        My Day
      </Typography>
      <TodoContainer />
    </div>
  );
}

export default MyDay;
