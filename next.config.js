/** @type {import('next').NextConfig} */
const nextConfig = {
    //basePath:"/speakspace",
    typescript:{
        ignoreBuildErrors: true,
    },
    images:{
        loader:"custom",
        loaderFile:"/lib/loader.ts",
        remotePatterns:[{
            protocol:'https',
            hostname:'img.clerk.com'
        }]
    }
}

module.exports = nextConfig
