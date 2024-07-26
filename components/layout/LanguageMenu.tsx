'use client';

import LanguageIcon from '@mui/icons-material/Language';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useCookies } from 'react-cookie';
import { generateLanguageMenuEvent, HEADER_LANGUAGE_MENU_CLICKED } from '../../constants/events';
import { useTypedSelector } from '../../hooks/store';
import { COOKIE_LOCALE_NAME, locales } from '../../i18n/config';
import logEvent, { getEventUserData } from '../../utils/logEvent';
import Link from '../common/Link';

const menuItemStyle = {
  ':hover': { backgroundColor: 'transparent' },
  '& .MuiTouchRipple-root span': {
    backgroundColor: 'transparent',
  },
} as const;

const languageMap: { [key: string]: string } = {
  en: 'English',
  hi: 'Hindi',
  pt: 'Português',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
};

const buttonStyle = {
  height: 40,
  minWidth: { xs: 40, md: 64 },
  paddingX: 1,
  gap: 0.75,
  fontWeight: 400,
  color: 'common.white',
  ':hover': { backgroundColor: 'primary.light', color: 'primary.dark' },

  '& .MuiTouchRipple-root span': {
    backgroundColor: 'primary.main',
    opacity: 0.2,
  },
  '& .MuiButton-startIcon': { display: 'inline-flex', mx: 0 },
} as const;

export default function LanguageMenu() {
  const [cookies, setCookie] = useCookies([COOKIE_LOCALE_NAME]);
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const userCreatedAt = useTypedSelector((state) => state.user.createdAt);
  const partnerAccesses = useTypedSelector((state) => state.partnerAccesses);
  const partnerAdmin = useTypedSelector((state) => state.partnerAdmin);
  const eventUserData = getEventUserData(userCreatedAt, partnerAccesses, partnerAdmin);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    logEvent(HEADER_LANGUAGE_MENU_CLICKED, eventUserData);
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        qa-id="language-menu-button"
        aria-controls="language-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        aria-label={t('languageMenu')}
        color="inherit"
        onClick={handleClick}
        startIcon={<LanguageIcon />}
        size="medium"
        sx={buttonStyle}
      >
        {languageMap[locale ? locale : 'en']}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        elevation={1}
        MenuListProps={{
          id: 'language-menu',
        }}
      >
        {locales
          ?.filter((language) => language !== locale)
          .map((language) => {
            const languageLabel = languageMap[language];
            return (
              <MenuItem key={language} sx={menuItemStyle}>
                <Button
                  component={Link}
                  href={pathname as string}
                  locale={language}
                  onClick={() => {
                    setCookie(COOKIE_LOCALE_NAME, language);
                    logEvent(generateLanguageMenuEvent(language), eventUserData);
                    handleClose();
                  }}
                >
                  {languageLabel}
                </Button>
              </MenuItem>
            );
          })}
      </Menu>
    </Box>
  );
}
