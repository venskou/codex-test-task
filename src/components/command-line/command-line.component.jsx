import React, { useState, useEffect, useCallback } from 'react';

import './command-line.styles.scss';

const CommandLine = ({ getPaintCommands }) => {
  // Available commands for execution and they params
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

  const [error, setError] = useState(null);
  const [enteredCommands, setEnteredCommands] = useState(`C 20 4`);

  // Handle writing in command textarea
  const handleCommandInput = ({ target: { value } }) => {
    setEnteredCommands(value);
  };

  const lintParam = useCallback((commandType, paramName, value, stringNum) => {
    const lintResult = {
      isValid: true,
      paramValidValue: value,
    };
    // Because this param describe fill in bucket fill command
    if (commandType === 'B' && paramName === 'c') {
      return { ...lintResult };
    }

    const isParamNum = Number(value);
    if (!isParamNum) {
      setError(
        `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not number`
      );
      return { ...lintResult, isValid: false };
    }

    const isParamInteger = Number.isInteger(isParamNum);
    if (!isParamInteger) {
      setError(
        `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not integer number`
      );
      return { ...lintResult, isValid: false };
    }

    return { ...lintResult, paramValidValue: Number(value) };
  }, []);

  const getCommand = useCallback(
    (command, stringNum) => {
      // Command type must always be the first character, make command params as another array
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
    },
    [commandTypes, lintParam]
  );

  const getExecutionCommands = useCallback(() => {
    // Dividing text on commands, parse by new line symbols
    const commandsArr = enteredCommands.trim().split(/\r?\n/);

    // Get array of objects with command params
    const executionCommands = commandsArr.map((command, stringNum) => {
      return getCommand(command, stringNum + 1);
    });

    // Check whether all commands are valid
    const isExecutionCommandsValid = executionCommands.every(command => command !== undefined);

    return isExecutionCommandsValid ? executionCommands : [];
  }, [enteredCommands, getCommand]);

  useEffect(() => {
    if (error) {
      setError(null);
    }

    if (!enteredCommands.length) return;

    // Get ready to execution commands from textarea
    const paintCommands = getExecutionCommands();
    getPaintCommands(paintCommands);

    // Set commands state at paint component
  }, [error, enteredCommands.length, getExecutionCommands, getPaintCommands]);

  return (
    <div className="command-line">
      <label className="command-line__input-label" htmlFor="command-line">
        Enter your commands here:
      </label>
      <textarea
        className="command-line__input"
        id="command-line"
        value={enteredCommands}
        onChange={handleCommandInput}
      />
      {error && <p className="command-line__error">{error}</p>}
    </div>
  );
};

export default React.memo(CommandLine);
