// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// Bracket tables
const symbols_l = ['{', '[', '('];
const symbols_r = ['}', ']', ')'];

// Return the top of the stack
const peek = (stack) => stack.slice(-1)[0];

// Show unbalanced brackets error
const show_error_popup = () => {
    console.error('Unbalanced brackets')
    // vscode.window.showInformationMessage('Unbalanced brackets :(');
}

// Behavior for `search_scope` towards left
const left = 
{
    predicate: (i, _) => i >= 0,
    step: -1,
    my_symbols: symbols_l,
    other_symbols: symbols_r
};

// Behavior for `search_scope` towards right
const right = 
{
    predicate: (i, text) => i < text.length,
    step: 1,
    my_symbols: symbols_r,
    other_symbols: symbols_l
};

function search_scope(text, offset, direction, then)
{
    // Stack of other brackets
    let stack = [];

    // Look for bracket towards direction
    for (let i = offset; direction.predicate(i, text); i += direction.step) 
    {
        // Current character
        const c = text[i];
        
        let matching_other = direction.other_symbols.indexOf(c);
        if(matching_other !== -1) 
        {
            // Found bracket of "other" kind while looking for "my" bracket
            stack.push(matching_other);
            continue;
        }
        
        let matching_my = direction.my_symbols.indexOf(c);
        if (matching_my === -1) 
        {
            continue;
        }
        else if(stack.length > 0)
        {
            // Found "my" bracket
            if(peek(stack) === matching_my)
            {
                // Bracket of "my" kind matches top of stack
                stack.pop();
                continue;
            }
            else
            {
                // Failure
                show_error_popup();
                return;
            }
        }
        else
        {
            then(i, matching_my);
            return;
        }
    }
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
// function activate(context) {

//     // Use the console to output diagnostic information (console.log) and errors (console.error)
//     // This line of code will only be executed once when your extension is activated
//     console.log('Congratulations, your extension "bracket-highlighter" is now active!');

//     // The command has been defined in the package.json file
//     // Now provide the implementation of the command with  registerCommand
//     // The commandId parameter must match the command field in package.json
//     // let disposable = vscode.commands.registerTextEditorCommand('extension.sayHello', function (editor) {
//         // The code you place here will be executed every time your command is executed
//         console.log('decorator sample is activated');
        
//             // create a decorator type that we use to decorate small numbers
//             const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
//                 borderWidth: '1px',
//                 borderStyle: 'solid',
//                 overviewRulerColor: 'blue',
//                 overviewRulerLane: vscode.OverviewRulerLane.Right,
//                 light: {
//                     // this color will be used in light color themes
//                     borderColor: 'darkblue'
//                 },
//                 dark: {
//                     // this color will be used in dark color themes
//                     borderColor: 'lightblue'
//                 }
//             });
        
//             // create a decorator type that we use to decorate large numbers
//             const largeNumberDecorationType = vscode.window.createTextEditorDecorationType({
//                 cursor: 'crosshair',
//                 backgroundColor: 'rgba(255,0,0,0.3)'
//             });
        
//             let activeEditor = vscode.window.activeTextEditor;
//             if (activeEditor) {
//                 triggerUpdateDecorations();
//             }
        
//             vscode.window.onDidChangeActiveTextEditor(editor => {
//                 activeEditor = editor;
//                 if (editor) {
//                     triggerUpdateDecorations();
//                 }
//             }, null, context.subscriptions);
        
//             vscode.workspace.onDidChangeTextDocument(event => {
//                 if (activeEditor && event.document === activeEditor.document) {
//                     triggerUpdateDecorations();
//                 }
//             }, null, context.subscriptions);
        
//             var timeout = null;
//             function triggerUpdateDecorations() {
//                 if (timeout) {
//                     clearTimeout(timeout);
//                 }
//                 timeout = setTimeout(updateDecorations, 500);
//             }
        
//             function updateDecorations() {
//                 if (!activeEditor) {
//                     return;
//                 }
//                 const regEx = /\d+/g;
//                 const text = activeEditor.document.getText();
//                 const smallNumbers= [];
//                 const largeNumbers= [];
//                 let match;
//                 while (match = regEx.exec(text)) {
//                     const startPos = activeEditor.document.positionAt(match.index);
//                     const endPos = activeEditor.document.positionAt(match.index + match[0].length);
//                     const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
//                     if (match[0].length < 3) {
//                         smallNumbers.push(decoration);
//                     } else {
//                         largeNumbers.push(decoration);
//                     }
//                 }
//                 activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
//                 activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
//             }
//         // // Display a message box to the user
//         // vscode.window.showInformationMessage('Hello World!');
//         // let document = editor.document;
//         // editor.selections = editor.selections.map((selection, selectionIdx) => 
//         // {
//         //     const text = document.getText();

//         //     let offset_l = document.offsetAt(selection.start);
//         //     let offset_r = document.offsetAt(selection.end) - 1;

//         //     // Try expanding selection to outer scope
//         //     if(offset_l > 0 && offset_r < text.length - 1)
//         //     {
//         //         // Try to get surrounding brackets
//         //         const s_l = symbols_l.indexOf(text[offset_l - 1]);
//         //         const s_r = symbols_r.indexOf(text[offset_r + 1]);

//         //         // Verify that both are brackets and match
//         //         const both_brackets = s_l !== -1 && s_r !== -1;
//         //         const equal = s_l === s_r;

//         //         if(both_brackets && equal)
//         //         {
//         //             // Expand selection
//         //             return new vscode.Selection(
//         //                 document.positionAt(offset_l - 1), document.positionAt(offset_r + 2));
//         //         }
//         //     }

//         //     // Search matching scopes, first to the left, then to the right
//         //     search_scope(text, offset_l - 1, left, (il, match_l) => 
//         //     {
//         //         search_scope(text, offset_r + 1, right, (ir, match_r) => 
//         //         {
//         //             if(match_l !== match_r)
//         //             {
//         //                 show_error_popup();
//         //                 return selection;
//         //             }

//         //             // Select everything inside the scope
//         //             let l_pos = document.positionAt(il + 1);
//         //             let r_pos = document.positionAt(ir);
//         //             selection = new vscode.Selection(l_pos, r_pos);
//         //         });
//         //     });

//         //     return selection;
//         // });
//     });

//     context.subscriptions.push(disposable);
// }

function activate(context) {
    
        console.log('decorator sample is activated');
    
        // create a decorator type that we use to decorate small numbers
        const smallNumberDecorationType = vscode.window.createTextEditorDecorationType({
            borderWidth: '1px',
            borderStyle: 'solid',
            overviewRulerColor: 'blue',
            overviewRulerLane: vscode.OverviewRulerLane.Right,
            light: {
                // this color will be used in light color themes
                borderColor: 'darkblue'
            },
            dark: {
                // this color will be used in dark color themes
                borderColor: 'lightblue'
            }
        });
    
        // create a decorator type that we use to decorate large numbers
        const largeNumberDecorationType = vscode.window.createTextEditorDecorationType({
            cursor: 'crosshair',
            backgroundColor: 'rgba(255,0,0,0.3)'
        });
        const bracketDecorationType = vscode.window.createTextEditorDecorationType({
            cursor: 'crosshair',
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius:'4px'
            
        });
        let activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            triggerUpdateSelections();
        }
        vscode.window.onDidChangeActiveTextEditor(editor => {
            activeEditor = editor;
            if (editor) {
                triggerUpdateSelections();
            }
        }, null, context.subscriptions);
        
        // vscode.workspace.onDidChangeTextDocument(event => {
        //     if (activeEditor && event.document === activeEditor.document) {
        //         triggerUpdateDecorations();
        //     }
        // }, null, context.subscriptions);
    
        var timeout = null;
        // function triggerUpdateDecorations() {
        //     console.log(activeEditor.selection.active);
        //     if (timeout) {
        //         clearTimeout(timeout);
        //     }
        //     timeout = setTimeout(updateDecorations, 500);
        // }
         function updateSelections() {
            //  console.log(activeEditor.selections);
            let arr=[];
            activeEditor.selections.map((selection, selectionIdx) => {
                let document = activeEditor.document;
                const text = document.getText();
                
                // let offset_l = document.offsetAt(selection.start);
                // let offset_r = document.offsetAt(selection.end) - 1;

                let offset_l = document.offsetAt(selection.active);
                let offset_r = document.offsetAt(selection.active) - 1;

                // Try expanding selection to outer scope
                if(offset_l > 0 && offset_r < text.length - 1)
                {
                    // Try to get surrounding brackets
                    const s_l = symbols_l.indexOf(text[offset_l - 1]);
                    const s_r = symbols_r.indexOf(text[offset_r + 1]);

                    // Verify that both are brackets and match
                    const both_brackets = s_l !== -1 && s_r !== -1;
                    const equal = s_l === s_r;

                    if(both_brackets && equal)
                    {
                        // Expand selection
                        return new vscode.Selection(
                            document.positionAt(offset_l - 1), document.positionAt(offset_r + 2));
                    }
                }

                // Search matching scopes, first to the left, then to the right
                search_scope(text, offset_l - 1, left, (il, match_l) => 
                {
                    search_scope(text, offset_r + 1, right, (ir, match_r) => 
                    {
                        if(match_l !== match_r)
                        {
                            show_error_popup();
                            return selection;
                        }

                        // Select everything inside the scope
                        let l_pos = document.positionAt(il + 1);
                        let l_pos1 = document.positionAt(il );
                        let r_pos = document.positionAt(ir);
                        let r_pos1 = document.positionAt(ir + 1);
                        console.log(l_pos.character,l_pos1.character,r_pos.character,r_pos1.character);
                        const decoration = { range: new vscode.Range(l_pos1,l_pos)};
                        const decoration2 = { range: new vscode.Range(r_pos, r_pos1)};
                        arr.push(decoration,decoration2);
                    });
                });
            
                return null;
            });
   
            activeEditor.setDecorations(bracketDecorationType,arr );
            
        }
        function triggerUpdateSelections() {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setInterval(updateSelections, 300);
        }
    
        // function updateDecorations() {
        //     if (!activeEditor) {
        //         return;
        //     }
        //     // const regEx = /\d+/g;
        //     // const text = activeEditor.document.getText();
        //     // const smallNumbers = [];
        //     // const largeNumbers = [];
        //     // let match;
        //     // while (match = regEx.exec(text)) {
        //     //     const startPos = activeEditor.document.positionAt(match.index);
        //     //     const endPos = activeEditor.document.positionAt(match.index + match[0].length);
        //     //     const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: 'Number **' + match[0] + '**' };
        //     //     if (match[0].length < 3) {
        //     //         smallNumbers.push(decoration);
        //     //     } else {
        //     //         largeNumbers.push(decoration);
        //     //     }
        //     // }
        //     // activeEditor.setDecorations(smallNumberDecorationType, smallNumbers);
        //     // activeEditor.setDecorations(largeNumberDecorationType, largeNumbers);
        // }
    }

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;