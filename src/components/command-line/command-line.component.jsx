import React, { useState, useEffect } from 'react';

import './command-line.styles.scss';

const CommandLine = () => {
  // Available commands for execution and they params
  const commandTypes = [
    {
      type: 'C',
      params: ['with', 'height'],
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
  const [commands, setCommands] = useState(`C 20 4`);

  // Handle writing in command textarea
  const handleCommandInput = ({ target: { value } }) => {
    setCommands(value);
  };

  const getExecutionCommands = () => {
    // Dividing text on commands, parse by new line symbols
    const commandsArr = commands.trim().split(/\r?\n/);

    const executionCommands = commandsArr.map((command, stringNum) => {
      // Get object with command params from this function
      return getCommand(command, stringNum + 1);
    });

    // Check whether all commands are valid
    const isExecutionCommandsValid = executionCommands.every(command => command !== undefined);

    return isExecutionCommandsValid ? executionCommands : undefined;
  };

  const getCommand = (command, stringNum) => {
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
        const paramsValid = lintParam(commandType, paramName, paramValue, stringNum);
        return {
          ...accum,
          paramsValid,
          [paramName]: paramsValid ? paramValue : undefined,
        };
      },
      { type: commandDescription.type }
    );

    return readyCommand.paramsValid ? readyCommand : undefined;
  };

  const lintParam = (commandType, paramName, value, stringNum) => {
    // Because this param describe fill in bucket fill command
    if (commandType === 'B' && paramName === 'c') {
      return true;
    }

    const isParamNum = Number(value);
    if (!isParamNum) {
      setError(
        `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not number`
      );
      return false;
    }

    const isParamInteger = Number.isInteger(isParamNum);
    if (!isParamInteger) {
      setError(
        `Error in line ${stringNum}: Parameter ${paramName} in command ${commandType} is not integer number`
      );
      return false;
    }

    return isParamNum && isParamInteger;
  };

  useEffect(() => {
    if (error) {
      setError(null);
    }

    if (!commands.length) return;

    // Get ready to execution commands from textarea
    getExecutionCommands();
  }, [commands]);

  return (
    <div className="command-line">
      <label className="command-line__input-label" htmlFor="command-line">
        Enter your commands here:
      </label>
      <textarea
        className="command-line__input"
        id="command-line"
        value={commands}
        onChange={handleCommandInput}
      />
      {error && <p className="command-line__error">{error}</p>}
    </div>
  );
};

export default CommandLine;
