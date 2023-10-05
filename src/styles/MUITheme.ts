import { createTheme, ThemeOptions } from '@mui/material/styles';

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light'
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { variant: 'h1' },
          style: {
            fontSize: '1.8rem',
            fontWeight: 'bold',
            padding: '0.8rem 0',
          },
        },
        {
          props: { variant: 'h2' },
          style: {
            fontSize: '1.4rem',
            fontWeight: 'bold',
            padding: '0.6rem 0',
          },
        },
        {
          props: { variant: 'h3' },
          style: {
            fontSize: '1.1rem',
            fontWeight: 'bold',
            padding: '0.4rem 0',
          },
        },
        {
          props: { variant: 'subtitle1' },
          style: {
            fontSize: '1rem',
            padding: '0.3rem 0',
          }
        }
      ],
    },
  }
}

export const theme = createTheme(themeOptions)
