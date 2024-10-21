import React, { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear"; // Importing clear icon

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#f7f7f7",
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: "center",
  color: theme.palette.text.primary,
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

function TodoContainer() {
  const [task, settask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [importance, setImportance] = useState("");
  const [urgency, setUrgency] = useState("");
  const [taskError, setTaskError] = useState(false); // Error state for task input

  const addTask = () => {
    if (task.trim() === "") {
      setTaskError(true);
      return; // Prevent adding empty tasks
    }
    setTaskError(false); // Reset error state
    if (importance && urgency) {
      const quadrant = getQuadrant(importance, urgency);
      setTasks([...tasks, { task, importance, urgency, quadrant }]);
      settask("");
      setImportance("");
      setUrgency("");
    }
  };

  const getQuadrant = (importance, urgency) => {
    if (importance === "Important" && urgency === "Urgent") {
      return "Do First";
    } else if (importance === "Important" && urgency === "Not Urgent") {
      return "Schedule";
    } else if (importance === "Not Important" && urgency === "Urgent") {
      return "Delegate";
    } else {
      return "Delete";
    }
  };

  return (
    <Box sx={{ flexGrow: 1, paddingTop: "64px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Item>
            <TextField
              fullWidth
              placeholder="Add a Task"
              value={task}
              onChange={(e) => settask(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  addTask();
                }
              }}
              variant="outlined"
              error={taskError} // Error state for input
              helperText={taskError ? "Task cannot be empty" : ""} // Error message
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => settask("")}
                    aria-label="clear task"
                    size="small"
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                ),
              }}
              sx={{ marginBottom: 2 }}
            />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="importance-label">Importance</InputLabel>
              <Select
                labelId="importance-label"
                value={importance}
                onChange={(e) => setImportance(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="Important">Important</MenuItem>
                <MenuItem value="Not Important">Not Important</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="urgency-label">Urgency</InputLabel>
              <Select
                labelId="urgency-label"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                variant="outlined"
              >
                <MenuItem value="Urgent">Urgent</MenuItem>
                <MenuItem value="Not Urgent">Not Urgent</MenuItem>
              </Select>
            </FormControl>
            <StyledButton variant="contained" color="primary" onClick={addTask}>
              Add Task
            </StyledButton>
          </Item>
        </Grid>
        <Grid item xs={12}>
          <Item>
            <List>
              {tasks.map((task, index) => (
                <StyledListItem key={index}>
                  <ListItemText
                    primary={task.task}
                    secondary={`Quadrant: ${task.quadrant}`}
                  />
                </StyledListItem>
              ))}
            </List>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TodoContainer;
