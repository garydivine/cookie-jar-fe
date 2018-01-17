import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkify'
})
export class LinkifyPipe implements PipeTransform {

  transform(link: string): string {
    return this.linkify(link);
  }

  private linkify(plainText): string{
    let replacedText;
    let replacePattern;

    //URLs starting with http://, https://
    replacePattern = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = plainText.replace(replacePattern, '<a href="$1" target="_blank">$1</a>');

    return replacedText;

}
}
