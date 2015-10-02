# Epic (for SWEN-344)

## Running Integration Tests  
```test/cukes.rb``` is a custom script to aid in running tests

By default, it runs all the priority 1 (Use Case) tests

It also accepts shorthand commands, for example
```
ruby cukes.rb login
```
Will run only the login tests.  

To run any tag, use the passthrough [--tags option](https://github.com/cucumber/cucumber/wiki/Tags) 

```
ruby cukes.rb --tags @demo
```

**Note for PowerShell users:** 
Powershell treats @ as a variable, so any must be escaped with backticks
