/** @type {import('next').NextConfig} */
const nextConfig = {
    //basePath:"/speakspace",
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
