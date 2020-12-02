'use strict'
function createPytestTestFileString({name, skip, output}) {
    return `# Generated by Python template
${output.hooks.deps.join('\n')}

${output.hooks.vars.join('\n')}

${output.hooks.beforeEach.join('\n')}

${skip ? '@pytest.mark.skip("generated")' : '' }
def ${name}(driver, eyes):
    ${output.commands.join('\n    ')}
`
}

module.exports = createPytestTestFileString
