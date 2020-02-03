import React, { Component } from 'react';

import './command-line.styles.scss';

const commandTypes = [
  {
    type: 'C',
    params: ['width', 'height'],
  },
  {
    type: 'L',
    params: ['x1', 'y1', 'x2', 'y2'],
  },
  {
    type: 'R',
    params: ['x1', 'y1', 'x2', 'y2'],
  },
  {
    type: 'B',
    params: ['x', 'y', 'c'],
  },
];

class CommandLine extends Component {
  state = {
    // Default commands from test task
    enteredCommands: `C 20 4
L 1 2 6 2
L 6 3 6 4
R 16 1 20 3
B 10 3 o
`,
  };

  handleCommandsInput = ({ target }) => {
    this.setState(
      {
        enteredCommands: target.value,
      },
      this.getExecutionCommands
    );
  };

  getExecutionCommands = () => {
    const { enteredCommands } = this.state;
    const { setError, setPaintCommands } = this.props;

    setError(null);

    if (!enteredCommands.trim().length) {
      setPaintCommands([]);
      return;
    }

    const lintParam = (commandType, paramName, value, stringNum) => {
      const { setError } = this.props;

      const lintResult = {
        isValid: true,
        paramValidValue: value,
      };

      // Because this param describe fill command
      if (commandType === 'B' && paramName === 'c') {
        if (value.length > 1) {
          setError(
            `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} must be only one symbol`
          );
          return { ...lintResult, isValid: false };
        }

        return { ...lintResult };
      }

      const numParam = Number(value);
      if (!numParam && numParam > 0) {
        setError(
          `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not number`
        );
        return { ...lintResult, isValid: false };
      }

      if (!numParam) {
        setError(`Error in line ${stringNum}: Parameter ${paramName} cannot be a zero`);
        return { ...lintResult, isValid: false };
      }

      if (numParam < 0) {
        setError(`Error in line ${stringNum}: Parameter ${paramName} cannot be a negative`);
        return { ...lintResult, isValid: false };
      }

      const isParamInteger = Number.isInteger(numParam);
      if (!isParamInteger) {
        setError(
          `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not integer number`
        );
        return { ...lintResult, isValid: false };
      }

      return { ...lintResult, paramValidValue: Number(value) };
    };

    const getCommand = (command, stringNum) => {
      const [commandType, ...commandParamsArr] = command.trim().split(/\s+/);

      // Check if typed command type is valid and get command description
      const commandDescription = commandTypes.find(
        command => command.type.toUpperCase() === commandType.toUpperCase()
      );

      if (!commandDescription) {
        setError(`Error in line ${stringNum}: Not correct command type`);
        return undefined;
      }

      // Check if we have all the parameters for the command
      const isAllParamsGiven = commandDescription.params.length === commandParamsArr.length;

      if (!isAllParamsGiven) {
        setError(`Error in line ${stringNum}: Not correct parameters count`);
        return undefined;
      }

      // Convert our command from params array in object, parsing command description params
      const readyCommand = commandDescription.params.reduce(
        (accum, paramName, index) => {
          // Get command type from our commend description
          const { type: commandType } = commandDescription;

          /*
          Get parameter value from entered params,
          because we parse params names in command description
          index of the parameter name in description === parameter value index in entered params array
        */
          const paramValue = commandParamsArr[index];

          // Check if we have right parameter value, add validation field in command object;
          const paramValidation = lintParam(commandType, paramName, paramValue, stringNum);
          const { isValid, paramValidValue } = paramValidation;

          return {
            ...accum,
            isValid,
            [paramName]: isValid ? paramValidValue : undefined,
          };
        },
        { type: commandDescription.type }
      );

      return readyCommand.isValid ? readyCommand : undefined;
    };

    const commandsArr = enteredCommands.trim().split(/\r?\n/);

    // Get array of objects with command params
    const executionCommands = commandsArr.map((command, stringNum) => {
      return getCommand(command, stringNum + 1);
    });

    // Check whether all commands are valid
    const isExecutionCommandsValid = executionCommands.every(command => command !== undefined);
    const commands = isExecutionCommandsValid ? executionCommands : [];
    setPaintCommands(commands);
  };

  componentDidMount() {
    const { enteredCommands } = this.state;
    if (enteredCommands.length) {
      this.getExecutionCommands();
    }
  }

  render() {
    const { enteredCommands } = this.state;
    return (
      <div className="form-group">
        <label htmlFor="command-line">Enter your commands here:</label>
        <textarea
          className="form-control command-line"
          id="command-line"
          value={enteredCommands}
          onChange={this.handleCommandsInput}
        />
      </div>
    );
  }
}

export default React.memo(CommandLine);
