# Hands-on with Spectral

## Brief

This repository accompanies the presentation at API Con by Chris Wood on 14th April 2021. The slides themselves are [here](slides/20210414_hands_on_with_spectral.pdf).

## Flow

The intention is to show an increasingly level of maturity in the implementation. The intention is therefore to convey the following "flow":

1. Start with nothing.
2. Add a ruleset that extends the built-in Spectral ruleset.
3. Switch some of the Spectral rules off.
4. Implement a rule to govern URI constructs with a built-in function.
5. Implement a rule to govern return codes with a custom function.
6. Implement a reusable ruleset that references IT Security standards.
7. Add some automation using Husky and pre-commit hooks.

## Scenarios:

1. No ruleset.
2. Simple ruleset.
3. Turn warnings off.
4. Standardised the URI format.
5. Ensure that Responses object for each Operation Object has at least a `default` response.
6. Ensure that all "write" operations have a security mechanism defined.
7. Implement a pre-commit hook to ensure an OpenAPI document lints with zero errors or warnings.

## Commands in presentation

```bash
# Scenario 1: Run the out-of-the-box command
spectral lint examples/petstore-openapi-scenario-1.yaml

# Scenario 2: View the boilerplate rule
vi rulesets/petstore-scenario-2.yaml

# Scenario 2: Run the boilerplate rule
spectral lint --ruleset rulesets/petstore-scenario-2.yaml examples/petstore-openapi-scenario-2.yaml

# Scenario 3: View the ruleset that switches off rules
vi rulesets/petstore-scenario-3.yaml

# Scenario 3: Run the ruleset that switches off rules
spectral lint --ruleset rulesets/petstore-scenario-3.yaml examples/petstore-openapi-scenario-3.yaml

# Scenario 4: View the ruleset that implements a rule that uses a built-in function
vi rulesets/petstore-scenario-4.yaml

# Scenario 4: Run the built-in function ruleset against the Scenario 3 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-4.yaml examples/petstore-openapi-scenario-3.yaml

# Scenario 4: Compare the Scenario 3 and Scenario 4 rulesets
vimdiff examples/petstore-openapi-scenario-3.yaml examples/petstore-openapi-scenario-4.yaml

# Scenario 4: Run the built-in function ruleset against the Scenario 4 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-4.yaml examples/petstore-openapi-scenario-4.yaml

# Scenario 5: View the ruleset that implements a rule that uses a custom function
vi rulesets/petstore-scenario-5.yaml rulesets/functions/responses.js

# Scenario 5: Run the custom function ruleset against the Scenario 4 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-5.yaml examples/petstore-openapi-scenario-4.yaml

# Scenario 5: Compare the Scenario 4 and Scenario 5 OpenAPI documents
vimdiff examples/petstore-openapi-scenario-4.yaml examples/petstore-openapi-scenario-5.yaml

# Scenario 5: Run the custom function ruleset against the Scenario 5 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-5.yaml examples/petstore-openapi-scenario-5.yaml

# Scenario 6: View both IT Security team ruleset and custom function and merge of these rulesets
vi rulesets/petstore-scenario-6a.yaml rulesets/functions/empty-object.js rulesets/petstore-scenario-6b.yaml

# Scenario 6: Run the merged ruleset against the Scenario 5 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-6b.yaml examples/petstore-openapi-scenario-5.yaml

# Scenario 6: Compare the Scenario 5 and Scenario 6 OpenAPI documents
vimdiff examples/petstore-openapi-scenario-5.yaml examples/petstore-openapi-scenario-6.yaml

# Scenario 6: Run the merged ruleset against the Scenario 6 OpenAPI document
spectral lint --ruleset rulesets/petstore-scenario-6b.yaml examples/petstore-openapi-scenario-6.yaml

# Scenario 7: View the pre-commit script
vi .husky/pre-commit

# Scenario 7: Touch in an empty file that "looks" like an OpenAPI document
touch examples/petstore-openapi-scenario-7.yaml && git add examples/petstore-openapi-scenario-7.yaml

# Scenario 7: Attempt to commit the file
git commit -a -m 'chore: Testing hooks'
echo $?
git status
```

## Husky Configuration

This adds a pre-commit hook that lints any files being committed that "look like" OpenAPI documents.

> Note this isn't perfect as ideally you'd only lint the files actually being committed, but it's good enough for the purpose of exemplar.

```bash
# Initialise the Husky (v6.x version of package) directory
npx husky-init && npm install

# Add pre-commit hook that uses the porcelain version for git status
#
# Note the regular expression does not deal with [A|M]D (added or modified and then deleted) so definite
# room for improvement, AWK does not support negative lookaheads so different approach required
npx husky add .husky/pre-commit \
"git status --porcelain | awk '/^ ?[AM].*(swagger|openapi).*\.(yaml|json|yml)/ { print \$NF }' | xargs spectral lint --fail-severity=warn --ruleset rulesets/petstore-scenario-7.yaml"
```