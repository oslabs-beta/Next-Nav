import expect from 'expect';
import * as path from 'path';
import { checkForClientDirective } from '.././src/makeTree';

describe('testing checkFor ClientDirective', ()=> {
 

  it('it should be able to find a use clients with no comments', async () => {
    const dir = path.join(__dirname, './testfiles/basic-client.js');
    console.log(dir);
    expect(await checkForClientDirective(dir)).toEqual(true);
  });

  it('it should be able to find a use client in comments', async () => {
    const dir = path.join(__dirname, './testfiles/client-in-comments.js');
    console.log(dir);
    expect(await checkForClientDirective(dir)).toEqual(true);
  });

  it('it should be able to find a use client after comments', async () => {
    const dir = path.join(__dirname, './testfiles/comments-before-client.js');
    expect(await checkForClientDirective(dir)).toEqual(true);
  });

  it('it should be able to find something that doesnt match use client in comments', async () => {
    const dir = path.join(__dirname, './testfiles/server-in-comments.js');
    expect(await checkForClientDirective(dir)).toEqual(false);
  });

  it('it should be able to find something that doesnt match use client after comments', async () => {
    const dir = path.join(__dirname, './testfiles/comments-before-server.js');
    expect(await checkForClientDirective(dir)).toEqual(false);
  });


});

