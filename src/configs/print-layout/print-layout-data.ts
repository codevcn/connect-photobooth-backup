import { TPrintLayout, TLayoutType } from '@/utils/types/print-layout'

export function hardCodedLayoutData(): TPrintLayout[]
export function hardCodedLayoutData(layoutType: TLayoutType): TPrintLayout[]

export function hardCodedLayoutData(layoutType?: TLayoutType): TPrintLayout[] {
  const template1: TPrintLayout = {
    id: 'template-1',
    name: 'Default Template 1',
    layoutType: 'full',
    printedImageElements: [],
  }
  const template2: TPrintLayout = {
    id: 'template-2',
    name: 'Default Template 2',
    layoutType: 'half-width',
    printedImageElements: [],
  }
  const template3: TPrintLayout = {
    id: 'template-3',
    name: 'Default Template 3',
    layoutType: 'half-height',
    printedImageElements: [],
  }
  const template4: TPrintLayout = {
    id: 'template-4',
    name: 'Default Template 4',
    layoutType: '3-left',
    printedImageElements: [],
  }
  const template5: TPrintLayout = {
    id: 'template-5',
    name: 'Default Template 5',
    layoutType: '3-right',
    printedImageElements: [],
  }
  const template6: TPrintLayout = {
    id: 'template-6',
    name: 'Default Template 6',
    layoutType: '3-top',
    printedImageElements: [],
  }
  const template7: TPrintLayout = {
    id: 'template-7',
    name: 'Default Template 7',
    layoutType: '3-bottom',
    printedImageElements: [],
  }
  const template8: TPrintLayout = {
    id: 'template-8',
    name: 'Default Template 8',
    layoutType: '4-horizon',
    printedImageElements: [],
  }
  const template9: TPrintLayout = {
    id: 'template-9',
    name: 'Default Template 9',
    layoutType: '4-vertical',
    printedImageElements: [],
  }
  const template10: TPrintLayout = {
    id: 'template-10',
    name: 'Default Template 10',
    layoutType: '4-square',
    printedImageElements: [],
  }

  if (layoutType) {
    switch (layoutType) {
      case 'half-width':
        return [template2]
      case 'half-height':
        return [template3]
      case '3-left':
        return [template4]
      case '3-right':
        return [template5]
      case '3-top':
        return [template6]
      case '3-bottom':
        return [template7]
      case '4-horizon':
        return [template8]
      case '4-vertical':
        return [template9]
      case '4-square':
        return [template10]
      default:
        return [template1]
    }
  }

  return [
    template1,
    template2,
    template3,
    template4,
    template5,
    template6,
    template7,
    template8,
    template9,
    template10,
  ]
}
