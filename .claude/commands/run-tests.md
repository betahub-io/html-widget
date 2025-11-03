Your task is to run manual tests from the tests/ folder. Before we start, we need to confirm the scope. Ask the user if they want to test all of it or just certain funcitonalites. Propose them with selection option. Use your built-in selection format.

When selected, spawn a subagent, set it to run on the haiku model.
Pass it to check all the *.md files in the tests/ folder to understand how it should process the tests.
Pass it the scope.

When got back a bug list, analyze them in terms of severity and propose what should be fixed to the user. Check the bug root cause. Many bugs could are tests not being updated with the business logic codebase. For this purpose, check the recent changes and try to guess developer's intention.

Do not fix it without approval.

If any temporary files would be created by the agent (such as test reports, read them and remove them upon reading).