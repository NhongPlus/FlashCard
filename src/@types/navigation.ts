export interface NavigationTree {
  key: string
  path: string
  title: string
  translateKey: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  type?: 'title' | 'collapse' | 'item'
  authority: string[]
  subMenu?: SubMenuNavigationTree[]
}

export interface SubMenuNavigationTree {
  key: string
  path: string
  authority: string[]
  title: string
  translateKey: string
}
