import { NextResponse, NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const onboardingComplete = request.cookies.get('onboardingComplete')?.value === 'true';
  const pathname = request.nextUrl.pathname;

  // Skip redirect if already on onboarding page
  if (pathname.startsWith('/onboarding')) {
    return NextResponse.next();
  }

  // If not completed, redirect to /onboarding
  if (!onboardingComplete) {
    const onboardingUrl = request.nextUrl.clone();
    onboardingUrl.pathname = '/onboarding';
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - onboarding (onboarding routes)
     * - .well-known (standardized metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|onboarding|.well-known).*)',
  ],
}
